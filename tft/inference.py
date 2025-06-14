import sys
import json
import pickle
import pandas as pd
from pytorch_forecasting import TemporalFusionTransformer, TimeSeriesDataSet
import torch

TARGETS = ["ph", "suhu", "kekeruhan", "salinitas"]
BASE_PATH = "../tft"
DATASET_DIR = f"{BASE_PATH}/dataset_params"
MODEL_DIR = f"{BASE_PATH}/models"

def prepare_prediction_dataset(df, dataset_params):
    return TimeSeriesDataSet.from_parameters(
        dataset_params,
        df,
        stop_randomization=True
    )

def main():
    pd.set_option("display.max_columns", None)

    # 1. Load input dari stdin
    try:
        input_json = sys.stdin.read()
        input_data = json.loads(input_json)
        df = pd.json_normalize(input_data)
    except Exception as e:
        print(json.dumps({"error": f"Gagal membaca input JSON: {e}"}))
        return

    # 2. Validasi dan preprocessing dasar
    if "tanggal" not in df.columns or "is_future" not in df.columns:
        print(json.dumps({"error": "Input harus mengandung kolom 'tanggal' dan 'is_future'."}))
        return

    df["tanggal"] = pd.to_datetime(df["tanggal"])
    df = df.sort_values("tanggal").reset_index(drop=True)
    df["time_idx"] = (df["tanggal"] - df["tanggal"].min()).dt.days
    df["series_id"] = "all_data"

    if df[df["is_future"] == 1].empty:
        print(json.dumps({"error": "Data future (is_future==1) tidak ditemukan."}))
        return

    results = {
        "tanggal": df[df["is_future"] == 1]["tanggal"].dt.strftime("%Y-%m-%d").tolist()
    }

    for target in TARGETS:
        try:
            # 3. Load konfigurasi dataset
            with open(f"{DATASET_DIR}/{target}_dataset_params.pkl", "rb") as f:
                dataset_params = pickle.load(f)
        except Exception as e:
            print(json.dumps({"error": f"Gagal membuka dataset config untuk target '{target}': {e}"}))
            return

        max_encoder = dataset_params["max_encoder_length"]
        max_decoder = dataset_params["max_prediction_length"]

        # 4. Validasi panjang data
        encoder_len = df[df["is_future"] == 0]["time_idx"].nunique()
        decoder_len = df[df["is_future"] == 1]["time_idx"].nunique()

        if encoder_len < 1:
            print(json.dumps({"error": f"Data historis tidak ditemukan untuk target '{target}'."}))
            return
        if decoder_len > max_decoder:
            print(json.dumps({"error": f"Permintaan prediksi ({decoder_len}) melebihi batas model ({max_decoder}) untuk target '{target}'."}))
            return

        try:
            prediction_dataset = prepare_prediction_dataset(df.copy(), dataset_params)
        except Exception as e:
            print(json.dumps({"error": f"Dataset prediksi gagal untuk target '{target}': {e}"}))
            return

        try:
            model = TemporalFusionTransformer.load_from_checkpoint(
                checkpoint_path=f"{MODEL_DIR}/{target}_tft.ckpt"
            )
        except Exception as e:
            print(json.dumps({"error": f"Gagal memuat model untuk target '{target}': {e}"}))
            return

        try:
            dataloader = prediction_dataset.to_dataloader(train=False, batch_size=1)
            raw_preds = model.predict(dataloader, mode="prediction")

            # Ambil prediksi sebanyak jumlah time_idx future
            raw_preds = model.predict(dataloader, mode="raw")
            pred_values = raw_preds["prediction"]

            future_len = df[df["is_future"] == 1]["time_idx"].nunique()
            preds = pred_values[0][:future_len]
            if isinstance(preds, torch.Tensor):
                preds = preds.detach().cpu().numpy()
            if preds.ndim > 1:
                preds = preds[:, 0]

            results[target] = preds.tolist()
        except Exception as e:
            print(json.dumps({"error": f"Gagal melakukan prediksi untuk target '{target}': {e}"}))
            return

    print("===BEGIN_RESULT===")
    print(json.dumps(results))
    print("===END_RESULT===")

if __name__ == "__main__":
    main()
