import sys
import os
import pandas as pd
import json
import torch
import pickle
from pytorch_forecasting import TimeSeriesDataSet, TemporalFusionTransformer
from pytorch_lightning import Trainer
from pytorch_forecasting.data.encoders import GroupNormalizer
from torchmetrics import MeanAbsoluteError
from pytorch_lightning.loggers import TensorBoardLogger

# Logger TensorBoard
logger = TensorBoardLogger("lightning_logs", name="tft_logs")

def read_json_from_stdin():
    try:
        input_json = sys.stdin.read()
        input_data = json.loads(input_json)
        df = pd.json_normalize(input_data)
        return df
    except Exception as e:
        print(json.dumps({"error": f"Gagal membaca input JSON: {e}"}))
        sys.exit(1)

# Fungsi untuk load dan preprocess data
def preprocess_dataframe(df):
    df["tanggal"] = pd.to_datetime(df["tanggal"])
    df = df.sort_values("tanggal")
    df["time_idx"] = (df["tanggal"] - df["tanggal"].min()).dt.days
    df["series_id"] = "all_data"

    df["kedalaman"] = df["kedalaman"].astype(float)
    df["substrat"] = df["substrat"].astype(str)
    df["musim"] = df["musim"].astype(str)
    df["bulan"] = df["bulan"].astype(str)

    if "fluktuasi_ph" not in df.columns:
        df["fluktuasi_ph"] = df["ph"].diff().abs().fillna(0)

    static_categoricals = ["substrat"]
    static_reals = ["kedalaman"]
    known_categoricals = ["bulan", "musim"]
    known_reals = ["curah_hujan"]
    unknown_inputs = ["ph", "suhu", "kekeruhan", "salinitas", "fluktuasi_ph"]
    target_columns = ["ph", "suhu", "kekeruhan", "salinitas"]

    return (
        df,
        static_categoricals,
        static_reals,
        known_categoricals,
        known_reals,
        unknown_inputs,
        target_columns
    )

# Fungsi untuk membuat dataset TFT
def create_dataset(df, target, static_categoricals, static_reals, known_categoricals, known_reals,
                   unknown_inputs, max_encoder_length=30, max_prediction_length=30):
    return TimeSeriesDataSet(
        df,
        time_idx="time_idx",
        target=target,
        group_ids=["series_id"],
        max_encoder_length=max_encoder_length,
        max_prediction_length=max_prediction_length,
        static_categoricals=static_categoricals,
        static_reals=static_reals,
        time_varying_known_categoricals=known_categoricals,
        time_varying_known_reals=known_reals,
        time_varying_unknown_categoricals=[],
        time_varying_unknown_reals=[target] + [col for col in unknown_inputs if col != target],
        target_normalizer=GroupNormalizer(groups=["series_id"]),
        add_relative_time_idx=True,
        add_target_scales=True,
        add_encoder_length=True,
        allow_missing_timesteps=True,
    )

# Fungsi training dan penyimpanan model
def train_model_per_target(
    df,
    static_categoricals,
    static_reals,
    known_categoricals,
    known_reals,
    unknown_inputs,
    target_columns,
    max_encoder_length,
    prediction_length,
):
    os.makedirs("./models", exist_ok=True)
    os.makedirs("./data", exist_ok=True)
    original_df = df.copy()

    for target in target_columns:
        print(f"\n Training model untuk target: {target}")

        dataset = create_dataset(
            df=df,
            target=target,
            static_categoricals=static_categoricals,
            static_reals=static_reals,
            known_categoricals=known_categoricals,
            known_reals=known_reals,
            unknown_inputs=unknown_inputs,
            max_encoder_length=max_encoder_length,
            max_prediction_length=prediction_length
        )

        train_dataloader = dataset.to_dataloader(train=True, batch_size=32)

        # Simpan parameter dataset
        with open(f"./data/{target}_dataset_params.pkl", "wb") as f:
            pickle.dump(dataset.get_parameters(), f)

        model = TemporalFusionTransformer.from_dataset(
            dataset,
            learning_rate=1e-3,
            hidden_size=16,
            attention_head_size=1,
            dropout=0.1,
            hidden_continuous_size=8,
            output_size=1,
            loss=MeanAbsoluteError(),
            log_interval=10,
            log_val_interval=1,
        )

        trainer = Trainer(
            max_epochs=50,
            gradient_clip_val=0.1,
            logger=logger,
            enable_checkpointing=True,
            default_root_dir=f"./models/{target.lower()}"
        )
        trainer.fit(model, train_dataloaders=train_dataloader)

        ckpt_path = f"./models/{target.lower()}_tft.ckpt"
        trainer.save_checkpoint(ckpt_path)
        print(f" Model disimpan ke: {ckpt_path}")

        with open(f"./data/{target}_raw_df.pkl", "wb") as f:
            pickle.dump(original_df, f)
        print(f" Dataset dan data asli disimpan untuk target: {target}")

    print("\n Semua model selesai dilatih dan disimpan.")

if __name__ == "__main__":
    df_raw = read_json_from_stdin()

    (
        df,
        static_categoricals,
        static_reals,
        known_categoricals,
        known_reals,
        unknown_inputs,
        target_columns
    ) = preprocess_dataframe(df_raw)
    # print(df_raw, flush=True)
    print("\n Cek nilai kosong:")
    print(df.isnull().sum())

    print("\n Mulai proses training model:")
    train_model_per_target(
        df=df,
        static_categoricals=static_categoricals,
        static_reals=static_reals,
        known_categoricals=known_categoricals,
        known_reals=known_reals,
        unknown_inputs=unknown_inputs,
        target_columns=target_columns,
        max_encoder_length=30,
        prediction_length=30
    )
