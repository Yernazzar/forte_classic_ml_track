import React, { useState } from 'react';
import { Activity, Shield, AlertTriangle, TrendingUp, Clock, Smartphone, Calendar, CreditCard, LogIn, BarChart3 } from 'lucide-react';
import './App.css';

const FraudDetectionUI = () => {
  const [formData, setFormData] = useState({
    // Основные параметры транзакции
    amount: '',
    hour: '',
    dayofweek: '',
    month: '',
    day: '',
    
    // Поведенческие паттерны
    monthly_os_changes: '',
    logins_last_7_days: '',
    logins_last_30_days: '',
    login_frequency_7d: '',
    logins_7d_over_30d_ratio: '',
    avg_login_interval_30d: '',
    std_login_interval_30d: '',
    ewm_login_interval_7d: '',
    burstiness_login_interval: '',
    fano_factor_login_interval: '',
    zscore_avg_login_interval_7d: '',
    
    // Скользящие статистики
    amount_roll_3d_mean: '',
    amount_roll_7d_mean: '',
    amount_roll_14d_mean: '',
    txncount_roll_3d_mean: '',
    txncount_roll_7d_mean: '',
    txncount_roll_14d_mean: '',
    
    // Дополнительные параметры
    is_weekend: '0',
    direction_was_before: '0',
    phone_iphone: '0',
    phone_samsung: '0',
    operating_system: '0',
    os_version: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Функция для подготовки данных для модели
  const prepareModelData = (formData) => {
    // Преобразуем данные в формат, который ожидает модель
    const modelData = {
      amount: parseFloat(formData.amount) || 0,
      monthly_os_changes: parseFloat(formData.monthly_os_changes) || 0,
      logins_last_7_days: parseFloat(formData.logins_last_7_days) || 0,
      logins_last_30_days: parseFloat(formData.logins_last_30_days) || 0,
      login_frequency_7d: parseFloat(formData.login_frequency_7d) || 0,
      logins_7d_over_30d_ratio: parseFloat(formData.logins_7d_over_30d_ratio) || 0,
      avg_login_interval_30d: parseFloat(formData.avg_login_interval_30d) || 0,
      std_login_interval_30d: parseFloat(formData.std_login_interval_30d) || 0,
      ewm_login_interval_7d: parseFloat(formData.ewm_login_interval_7d) || 0,
      burstiness_login_interval: parseFloat(formData.burstiness_login_interval) || 0,
      fano_factor_login_interval: parseFloat(formData.fano_factor_login_interval) || 0,
      zscore_avg_login_interval_7d: parseFloat(formData.zscore_avg_login_interval_7d) || 0,
      hour: parseFloat(formData.hour) || 0,
      dayofweek: parseFloat(formData.dayofweek) || 0,
      month: parseFloat(formData.month) || 0,
      day: parseFloat(formData.day) || 0,
      amount_roll_3d_mean: parseFloat(formData.amount_roll_3d_mean) || 0,
      amount_roll_7d_mean: parseFloat(formData.amount_roll_7d_mean) || 0,
      amount_roll_14d_mean: parseFloat(formData.amount_roll_14d_mean) || 0,
      txncount_roll_3d_mean: parseFloat(formData.txncount_roll_3d_mean) || 0,
      txncount_roll_7d_mean: parseFloat(formData.txncount_roll_7d_mean) || 0,
      txncount_roll_14d_mean: parseFloat(formData.txncount_roll_14d_mean) || 0,
      is_weekend: parseInt(formData.is_weekend) || 0,
      direction_was_before: parseInt(formData.direction_was_before) || 0,
      phone_iphone: parseInt(formData.phone_iphone) || 0,
      phone_samsung: parseInt(formData.phone_samsung) || 0,
      operating_system: parseInt(formData.operating_system) || 0,
      os_version: parseFloat(formData.os_version) || 0
    };

    return modelData;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    
    // Подготавливаем данные для модели
    const modelData = prepareModelData(formData);
    console.log('Данные для модели:', modelData);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setPrediction(result);
    } catch (error) {
      console.error('Ошибка при вызове модели:', error);
      // Fallback на случай ошибки (демо-режим)
      const randomProbability = Math.random();
      const isFraud = randomProbability > 0.7;
      
      setPrediction({
        isFraud: isFraud,
        probability: isFraud ? (0.7 + Math.random() * 0.3) : (Math.random() * 0.3),
        confidence: (85 + Math.random() * 10).toFixed(1),
        riskScore: Math.floor(Math.random() * 100),
        featuresUsed: Object.keys(modelData).length,
        error: error.message,
        isDemo: true
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      hour: '',
      dayofweek: '',
      month: '',
      day: '',
      monthly_os_changes: '',
      logins_last_7_days: '',
      logins_last_30_days: '',
      login_frequency_7d: '',
      logins_7d_over_30d_ratio: '',
      avg_login_interval_30d: '',
      std_login_interval_30d: '',
      ewm_login_interval_7d: '',
      burstiness_login_interval: '',
      fano_factor_login_interval: '',
      zscore_avg_login_interval_7d: '',
      amount_roll_3d_mean: '',
      amount_roll_7d_mean: '',
      amount_roll_14d_mean: '',
      txncount_roll_3d_mean: '',
      txncount_roll_7d_mean: '',
      txncount_roll_14d_mean: '',
      is_weekend: '0',
      direction_was_before: '0',
      phone_iphone: '0',
      phone_samsung: '0',
      operating_system: '0',
      os_version: ''
    });
    setPrediction(null);
  };

  // Функция для заполнения демо-данными
  const fillDemoData = () => {
    setFormData({
      amount: '45000',
      hour: '14',
      dayofweek: '3',
      month: '6',
      day: '15',
      monthly_os_changes: '0',
      logins_last_7_days: '5',
      logins_last_30_days: '20',
      login_frequency_7d: '0.71',
      logins_7d_over_30d_ratio: '0.25',
      avg_login_interval_30d: '2.5',
      std_login_interval_30d: '1.2',
      ewm_login_interval_7d: '2.1',
      burstiness_login_interval: '0.3',
      fano_factor_login_interval: '1.5',
      zscore_avg_login_interval_7d: '0.8',
      amount_roll_3d_mean: '42000',
      amount_roll_7d_mean: '38000',
      amount_roll_14d_mean: '35000',
      txncount_roll_3d_mean: '1.5',
      txncount_roll_7d_mean: '2.3',
      txncount_roll_14d_mean: '3.1',
      is_weekend: '0',
      direction_was_before: '0',
      phone_iphone: '0',
      phone_samsung: '1',
      operating_system: '0',
      os_version: '14.5'
    });
  };

  return (
    <div className="fraud-detection-container">
      <div className="main-wrapper">
        {/* Header */}
        <div className="header">
          <div className="logo-container">
            <div className="logo-glow"></div>
            <Shield className="logo-icon" />
          </div>
          <h1 className="title">Forte AI Hackathon</h1>
          <p className="subtitle">Детекция мошеннических транзакций</p>
        </div>

        <div className="content-grid">
          {/* Input Form */}
          <div className="form-panel">
            <div className="panel-header">
              <Activity className="panel-icon" />
              <h2>Параметры транзакции</h2>
            </div>

            {/* Кнопка демо-данных */}
            <div className="demo-section">
              <button 
                onClick={fillDemoData}
                className="demo-button"
                disabled={loading}
              >
                Заполнить демо-данными
              </button>
            </div>

            {/* Табы для группировки фич */}
            <div className="tabs-container">
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('basic')}
                >
                  <CreditCard size={16} />
                  Основные
                </button>
                <button 
                  className={`tab ${activeTab === 'behavior' ? 'active' : ''}`}
                  onClick={() => setActiveTab('behavior')}
                >
                  <LogIn size={16} />
                  Поведение
                </button>
                <button 
                  className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                  onClick={() => setActiveTab('stats')}
                >
                  <BarChart3 size={16} />
                  Статистики
                </button>
                <button 
                  className={`tab ${activeTab === 'device' ? 'active' : ''}`}
                  onClick={() => setActiveTab('device')}
                >
                  <Smartphone size={16} />
                  Устройство
                </button>
              </div>
            </div>

            <div className="form-fields">
              {/* Основные параметры */}
              {activeTab === 'basic' && (
                <div className="tab-content">
                  <InputField
                    icon={<CreditCard size={20} />}
                    label="Сумма транзакции"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="45000"
                  />

                  <div className="field-row">
                    <InputField
                      icon={<Clock size={20} />}
                      label="Час (0-23)"
                      name="hour"
                      type="number"
                      value={formData.hour}
                      onChange={handleInputChange}
                      placeholder="14"
                      min="0"
                      max="23"
                    />
                    <InputField
                      icon={<Calendar size={20} />}
                      label="День недели (0-6)"
                      name="dayofweek"
                      type="number"
                      value={formData.dayofweek}
                      onChange={handleInputChange}
                      placeholder="3"
                      min="0"
                      max="6"
                    />
                  </div>

                  <div className="field-row">
                    <InputField
                      label="Месяц (1-12)"
                      name="month"
                      type="number"
                      value={formData.month}
                      onChange={handleInputChange}
                      placeholder="6"
                      min="1"
                      max="12"
                    />
                    <InputField
                      label="День месяца"
                      name="day"
                      type="number"
                      value={formData.day}
                      onChange={handleInputChange}
                      placeholder="15"
                      min="1"
                      max="31"
                    />
                  </div>

                  <div className="toggles-section">
                    <ToggleField
                      label="Выходной день"
                      name="is_weekend"
                      checked={formData.is_weekend === '1'}
                      onChange={(checked) => setFormData(prev => ({ ...prev, is_weekend: checked ? '1' : '0' }))}
                    />
                    <ToggleField
                      label="Повторный получатель"
                      name="direction_was_before"
                      checked={formData.direction_was_before === '1'}
                      onChange={(checked) => setFormData(prev => ({ ...prev, direction_was_before: checked ? '1' : '0' }))}
                    />
                  </div>
                </div>
              )}

              {/* Поведенческие паттерны */}
              {activeTab === 'behavior' && (
                <div className="tab-content">
                  <InputField
                    label="Изменения ОС за месяц"
                    name="monthly_os_changes"
                    type="number"
                    value={formData.monthly_os_changes}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="1"
                  />

                  <div className="field-row">
                    <InputField
                      label="Логины (7 дней)"
                      name="logins_last_7_days"
                      type="number"
                      value={formData.logins_last_7_days}
                      onChange={handleInputChange}
                      placeholder="5"
                      step="1"
                    />
                    <InputField
                      label="Логины (30 дней)"
                      name="logins_last_30_days"
                      type="number"
                      value={formData.logins_last_30_days}
                      onChange={handleInputChange}
                      placeholder="20"
                      step="1"
                    />
                  </div>

                  <InputField
                    label="Частота логинов (7д)"
                    name="login_frequency_7d"
                    type="number"
                    step="0.01"
                    value={formData.login_frequency_7d}
                    onChange={handleInputChange}
                    placeholder="0.71"
                  />

                  <InputField
                    label="Отношение логинов 7д/30д"
                    name="logins_7d_over_30d_ratio"
                    type="number"
                    step="0.01"
                    value={formData.logins_7d_over_30d_ratio}
                    onChange={handleInputChange}
                    placeholder="0.25"
                  />

                  <div className="field-row">
                    <InputField
                      label="Ср. интервал логинов (30д)"
                      name="avg_login_interval_30d"
                      type="number"
                      step="0.01"
                      value={formData.avg_login_interval_30d}
                      onChange={handleInputChange}
                      placeholder="2.5"
                    />
                    <InputField
                      label="Стд. интервал логинов (30д)"
                      name="std_login_interval_30d"
                      type="number"
                      step="0.01"
                      value={formData.std_login_interval_30d}
                      onChange={handleInputChange}
                      placeholder="1.2"
                    />
                  </div>

                  <InputField
                    label="EWM интервал логинов (7д)"
                    name="ewm_login_interval_7d"
                    type="number"
                    step="0.01"
                    value={formData.ewm_login_interval_7d}
                    onChange={handleInputChange}
                    placeholder="2.1"
                  />

                  <div className="field-row">
                    <InputField
                      label="Burstiness логинов"
                      name="burstiness_login_interval"
                      type="number"
                      step="0.01"
                      value={formData.burstiness_login_interval}
                      onChange={handleInputChange}
                      placeholder="0.3"
                    />
                    <InputField
                      label="Fano Factor логинов"
                      name="fano_factor_login_interval"
                      type="number"
                      step="0.01"
                      value={formData.fano_factor_login_interval}
                      onChange={handleInputChange}
                      placeholder="1.5"
                    />
                  </div>

                  <InputField
                    label="Z-score интервала логинов"
                    name="zscore_avg_login_interval_7d"
                    type="number"
                    step="0.01"
                    value={formData.zscore_avg_login_interval_7d}
                    onChange={handleInputChange}
                    placeholder="0.8"
                  />
                </div>
              )}

              {/* Скользящие статистики */}
              {activeTab === 'stats' && (
                <div className="tab-content">
                  <h4 className="section-title">Скользящие средние суммы</h4>
                  <div className="field-row">
                    <InputField
                      label="3 дня"
                      name="amount_roll_3d_mean"
                      type="number"
                      value={formData.amount_roll_3d_mean}
                      onChange={handleInputChange}
                      placeholder="42000"
                    />
                    <InputField
                      label="7 дней"
                      name="amount_roll_7d_mean"
                      type="number"
                      value={formData.amount_roll_7d_mean}
                      onChange={handleInputChange}
                      placeholder="38000"
                    />
                  </div>
                  <InputField
                    label="14 дней"
                    name="amount_roll_14d_mean"
                    type="number"
                    value={formData.amount_roll_14d_mean}
                    onChange={handleInputChange}
                    placeholder="35000"
                  />

                  <h4 className="section-title">Скользящее количество транзакций</h4>
                  <div className="field-row">
                    <InputField
                      label="3 дня"
                      name="txncount_roll_3d_mean"
                      type="number"
                      step="0.01"
                      value={formData.txncount_roll_3d_mean}
                      onChange={handleInputChange}
                      placeholder="1.5"
                    />
                    <InputField
                      label="7 дней"
                      name="txncount_roll_7d_mean"
                      type="number"
                      step="0.01"
                      value={formData.txncount_roll_7d_mean}
                      onChange={handleInputChange}
                      placeholder="2.3"
                    />
                  </div>
                  <InputField
                    label="14 дней"
                    name="txncount_roll_14d_mean"
                    type="number"
                    step="0.01"
                    value={formData.txncount_roll_14d_mean}
                    onChange={handleInputChange}
                    placeholder="3.1"
                  />
                </div>
              )}

              {/* Информация об устройстве */}
              {activeTab === 'device' && (
                <div className="tab-content">
                  <SelectField
                    label="Тип телефона"
                    name="phone_type"
                    value={formData.phone_iphone === '1' ? 'iphone' : formData.phone_samsung === '1' ? 'samsung' : 'other'}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        phone_iphone: val === 'iphone' ? '1' : '0',
                        phone_samsung: val === 'samsung' ? '1' : '0'
                      }));
                    }}
                    options={[
                      { value: 'other', label: 'Другой' },
                      { value: 'iphone', label: 'iPhone' },
                      { value: 'samsung', label: 'Samsung' }
                    ]}
                  />

                  <div className="field-row">
                    <SelectField
                      label="Операционная система"
                      name="operating_system"
                      value={formData.operating_system}
                      onChange={handleInputChange}
                      options={[
                        { value: '0', label: 'Android' },
                        { value: '1', label: 'iOS' }
                      ]}
                    />
                    <InputField
                      label="Версия ОС"
                      name="os_version"
                      type="number"
                      step="0.1"
                      value={formData.os_version}
                      onChange={handleInputChange}
                      placeholder="14.5"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="predict-button"
              >
                {loading ? (
                  <span className="button-loading">
                    <div className="spinner"></div>
                    Анализ...
                  </span>
                ) : (
                  'Проверить транзакцию'
                )}
              </button>
              <button
                onClick={resetForm}
                className="reset-button"
                disabled={loading}
              >
                Сброс
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="results-panel">
            <div className="panel-header">
              <AlertTriangle className="results-icon" />
              <h2>Результат анализа</h2>
            </div>

            {!prediction && !loading && (
              <div className="empty-state">
                <div className="empty-icon">
                  <Shield className="shield-icon" />
                </div>
                <p className="empty-text">
                  Заполните форму и нажмите<br />
                  "Проверить транзакцию"
                </p>
                <button 
                  onClick={fillDemoData}
                  className="demo-button-small"
                >
                  Быстрый тест
                </button>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="loading-spinner">
                  <div className="spinner-outer"></div>
                  <div className="spinner-inner"></div>
                </div>
                <p className="loading-text">Анализируем транзакцию...</p>
                <p className="loading-subtext">Используется ML модель XGBoost</p>
              </div>
            )}

            {prediction && !loading && (
              <div className="results-content">
                {prediction.error && (
                  <div className="error-card">
                    <AlertTriangle size={20} />
                    <div>
                      <p><strong>Ошибка подключения к модели</strong></p>
                      <p>Используется демо-режим: {prediction.error}</p>
                    </div>
                  </div>
                )}

                {prediction.isDemo && !prediction.error && (
                  <div className="demo-card">
                    <AlertTriangle size={20} />
                    <p>Используется демо-режим (сервер недоступен)</p>
                  </div>
                )}

                <div className={`result-main ${prediction.isFraud ? 'fraud' : 'safe'}`}>
                  <div className="result-header">
                    {prediction.isFraud ? (
                      <AlertTriangle className="result-status-icon fraud" />
                    ) : (
                      <Shield className="result-status-icon safe" />
                    )}
                    <div className="probability">
                      <p className="probability-label">Вероятность</p>
                      <p className="probability-value">
                        {(prediction.probability * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <h3 className={`result-title ${prediction.isFraud ? 'fraud' : 'safe'}`}>
                    {prediction.isFraud ? 'МОШЕННИЧЕСТВО ОБНАРУЖЕНО' : 'ТРАНЗАКЦИЯ БЕЗОПАСНА'}
                  </h3>
                </div>

                <div className="metrics-grid">
                  <MetricCard
                    label="Уровень доверия"
                    value={`${prediction.confidence}%`}
                    color="blue"
                  />
                  <MetricCard
                    label="Risk Score"
                    value={prediction.riskScore}
                    color="purple"
                  />
                </div>

                {prediction.featuresUsed && (
                  <div className="info-card">
                    <p>Проанализировано признаков: <strong>{prediction.featuresUsed}</strong></p>
                    <p className="info-subtext">Модель: XGBoost с WOE трансформацией</p>
                  </div>
                )}

                {prediction.isFraud && (
                  <div className="risk-factors">
                    <h4>
                      <AlertTriangle size={20} />
                      Факторы риска
                    </h4>
                    <ul>
                      <li>• Необычная сумма транзакции</li>
                      <li>• Аномальное время совершения</li>
                      <li>• Изменение поведенческих паттернов</li>
                      <li>• Подозрительная активность устройства</li>
                    </ul>
                  </div>
                )}

                <div className={`recommendation ${prediction.isFraud ? 'fraud' : 'safe'}`}>
                  <h4>Рекомендация</h4>
                  <p>
                    {prediction.isFraud 
                      ? 'Рекомендуется заблокировать транзакцию и связаться с клиентом для подтверждения.'
                      : 'Транзакция может быть одобрена без дополнительных проверок.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Компоненты остаются такими же
const InputField = ({ icon, label, name, type, value, onChange, placeholder, min, max, step }) => (
  <div className="input-field">
    <label className="input-label">{label}</label>
    <div className="input-container">
      {icon && (
        <div className="input-icon">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className={`input-element ${icon ? 'with-icon' : ''}`}
      />
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div className="select-field">
    <label className="input-label">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="select-element"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const ToggleField = ({ label, name, checked, onChange }) => (
  <div className="toggle-field">
    <span className="toggle-label">{label}</span>
    <button
      onClick={() => onChange(!checked)}
      className={`toggle-button ${checked ? 'checked' : ''}`}
    >
      <div className={`toggle-slider ${checked ? 'checked' : ''}`} />
    </button>
  </div>
);

const MetricCard = ({ label, value, color }) => {
  const colorClass = color === 'blue' ? 'metric-blue' : 'metric-purple';
  
  return (
    <div className={`metric-card ${colorClass}`}>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </div>
  );
};

export default FraudDetectionUI;