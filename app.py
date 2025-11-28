from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import logging
import os

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Улучшенная настройка CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Загружаем модель при старте сервера
try:
    model_path = 'xgboost_woe_model.pkl'
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        logger.info("✅ Модель успешно загружена")
    else:
        logger.warning(f"⚠️ Файл модели не найден: {model_path}")
        logger.warning("⚠️ Сервер будет работать в демо-режиме")
        model = None
except Exception as e:
    logger.error(f"❌ Ошибка загрузки модели: {e}")
    model = None

@app.route('/health', methods=['GET'])
def health_check():
    """Проверка здоровья сервера"""
    return jsonify({
        "status": "healthy", 
        "model_loaded": model is not None,
        "message": "Flask server is running",
        "version": "1.0.0"
    })

@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    """Эндпоинт для предсказаний"""
    
    # Обработка preflight запроса
    if request.method == 'OPTIONS':
        return '', 204
    
    if model is None:
        logger.warning("⚠️ Модель не загружена, используется демо-режим")
        # Возвращаем демо-результат
        return jsonify({
            "isFraud": False,
            "probability": 0.15,
            "confidence": 85.0,
            "riskScore": 15,
            "featuresUsed": 22,
            "modelUsed": False,
            "message": "Демо-режим: модель не загружена"
        })
    
    try:
        # Получаем данные из запроса
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Нет данных в запросе"}), 400
        
        logger.info(f"📨 Получены данные для предсказания")
        
        # Правильный порядок фич из вашей модели
        features = [
            'amount', 'monthly_os_changes', 'logins_last_7_days', 
            'logins_last_30_days', 'login_frequency_7d', 'logins_7d_over_30d_ratio',
            'avg_login_interval_30d', 'std_login_interval_30d', 'ewm_login_interval_7d',
            'burstiness_login_interval', 'fano_factor_login_interval', 'zscore_avg_login_interval_7d',
            'hour', 'dayofweek', 'month', 'day', 'amount_roll_3d_mean', 
            'amount_roll_7d_mean', 'amount_roll_14d_mean', 'txncount_roll_3d_mean',
            'txncount_roll_7d_mean', 'txncount_roll_14d_mean'
        ]
        
        # Создаем DataFrame с правильным порядком колонок
        input_data = {}
        for feature in features:
            input_data[feature] = [data.get(feature, 0)]
        
        input_df = pd.DataFrame(input_data)
        
        logger.info(f"📊 Данные подготовлены для модели. Форма: {input_df.shape}")
        
        # Делаем предсказание
        prediction_proba = model.predict_proba(input_df)[0]
        prediction = model.predict(input_df)[0]
        
        # Формируем ответ
        fraud_probability = float(prediction_proba[1])
        result = {
            "isFraud": bool(prediction),
            "probability": fraud_probability,
            "confidence": round(fraud_probability * 100, 1),
            "riskScore": int(fraud_probability * 100),
            "featuresUsed": len(features),
            "modelUsed": True
        }
        
        logger.info(f"🎯 Предсказание: Fraud={result['isFraud']}, Probability={result['probability']:.3f}")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"❌ Ошибка предсказания: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    """Тестовый маршрут для проверки связи"""
    return jsonify({
        "message": "Flask server is working!",
        "model_loaded": model is not None,
        "status": "success",
        "endpoints": {
            "health": "/health",
            "predict": "/predict (POST)",
            "test": "/test (GET)"
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Запуск Flask сервера для детекции фрода")
    print("=" * 60)
    print(f"📍 Сервер: http://localhost:5000")
    print(f"🔗 Health check: http://localhost:5000/health")
    print(f"🔗 Test endpoint: http://localhost:5000/test")
    print(f"📦 Модель загружена: {'✅ Да' if model is not None else '❌ Нет (демо-режим)'}")
    print("=" * 60)
    print("💡 Для остановки: Ctrl+C")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)