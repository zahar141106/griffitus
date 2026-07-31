# Таблица Users

Хранение данных обо всех зарегистрированных пользователях системы Griffitus.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор пользователя
username -- VARCHAR(100) -- UNIQUE -- Логин пользователя
email -- VARCHAR(255) -- UNIQUE -- Адрес электронной почты пользователя
password_hash -- TEXT -- Хэш пароля пользователя
avatar -- TEXT -- URL изображения профиля пользователя
created_at -- TIMESTAMP -- Дата создания аккаунта
updated_at -- TIMESTAMP -- Дата последнего изменения данных пользователя
last_login -- TIMESTAMP -- Дата последнего успешного входа в систему
email_verified -- BOOLEAN -- Подтвержден ли адрес электронной почты
two_factor_enabled -- BOOLEAN -- Включена ли двухфакторная аутентификация
role -- VARCHAR(20) -- DEFAULT 'user' -- Роль пользователя
is_active -- BOOLEAN -- DEFAULT TRUE -- Активен ли аккаунт пользователя

---

# Таблица Devices

Хранение информации обо всех устройствах, зарегистрированных пользователями системы Griffitus.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор устройства
user_id -- UUID -- FOREIGN KEY -> Users.id -- Владелец устройства
device_name -- VARCHAR(100) -- Название устройства
device_type -- VARCHAR(30) -- Тип устройства
os_name -- VARCHAR(30) -- Операционная система
os_version -- VARCHAR(50) -- Версия операционной системы
agent_version -- VARCHAR(20) -- Версия Griffitus Agent
status -- VARCHAR(20) -- Статус устройства (online/offline)
last_seen -- TIMESTAMP -- Последнее время связи устройства с сервером
created_at -- TIMESTAMP -- Дата подключения устройства
updated_at -- TIMESTAMP -- Последнее обновление информации об устройстве
device_pin_hash -- TEXT -- Хэш PIN-кода устройства
two_factor_required -- BOOLEAN -- Требуется ли подтверждение перед подключением
qr_token -- UUID -- Одноразовый токен привязки устройства через QR-код
notes -- TEXT -- Пользовательская заметка об устройстве

---

# Таблица Agent

Хранение информации о программном агенте Griffitus Agent.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор агента
device_id -- UUID -- FOREIGN KEY -> Devices.id -- Устройство, на котором установлен агент
version -- VARCHAR(50) -- Версия Griffitus Agent
status -- VARCHAR(20) -- Состояние агента
last_heartbeat -- TIMESTAMP -- Последнее соединение агента с сервером
installed_at -- TIMESTAMP -- Дата установки агента
updated_at -- TIMESTAMP -- Последнее обновление агента

---

# Таблица DeviceMetrics

Хранение текущих характеристик устройства.
Используется для быстрого отображения состояния устройства в приложении.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор записи
device_id -- UUID -- FOREIGN KEY -> Devices.id -- Устройство
cpu_usage -- FLOAT -- Текущая загрузка процессора
ram_usage -- FLOAT -- Текущее использование оперативной памяти
disk_usage -- FLOAT -- Текущее использование диска
network_usage -- FLOAT -- Текущая загрузка сети
temperature -- FLOAT -- Температура компонентов устройства
battery_level -- INTEGER -- Уровень заряда батареи
updated_at -- TIMESTAMP -- Время последнего обновления данных

---

# Таблица MonitoringHistory

Хранение истории показателей устройства.
Используется для построения графиков CPU, RAM, SSD, Wi-Fi и анализа производительности.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор записи
device_id -- UUID -- FOREIGN KEY -> Devices.id -- Устройство
cpu_usage -- FLOAT -- Процент загрузки процессора
ram_usage -- FLOAT -- Процент использования оперативной памяти
disk_usage -- FLOAT -- Процент использования диска
network_usage -- FLOAT -- Использование сетевого соединения
temperature -- FLOAT -- Температура компонентов устройства
battery_level -- INTEGER -- Уровень заряда батареи
created_at -- TIMESTAMP -- Время получения данных

---

# Таблица Commands

Хранение истории команд, отправленных пользователем устройствам.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор команды
user_id -- UUID -- FOREIGN KEY -> Users.id -- Пользователь, отправивший команду
device_id -- UUID -- FOREIGN KEY -> Devices.id -- Устройство, получившее команду
command_type -- VARCHAR(50) -- Тип команды
command_data -- JSON -- Дополнительные параметры команды
status -- VARCHAR(20) -- Статус выполнения команды
created_at -- TIMESTAMP -- Время создания команды
executed_at -- TIMESTAMP -- Время выполнения команды

---

# Таблица Sessions

Хранение истории авторизаций пользователя.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор сессии
user_id -- UUID -- FOREIGN KEY -> Users.id -- Пользователь
device_id -- UUID -- FOREIGN KEY -> Devices.id -- Устройство пользователя
ip_address -- VARCHAR(45) -- IP-адрес подключения
user_agent -- TEXT -- Информация о клиентском устройстве
started_at -- TIMESTAMP -- Начало сессии
ended_at -- TIMESTAMP -- Завершение сессии

---

# Таблица Notifications

Хранение уведомлений системы Griffitus.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор уведомления
user_id -- UUID -- FOREIGN KEY -> Users.id -- Пользователь
title -- VARCHAR(100) -- Заголовок уведомления
message -- TEXT -- Текст уведомления
type -- VARCHAR(50) -- Тип уведомления
is_read -- BOOLEAN -- Прочитано ли уведомление
created_at -- TIMESTAMP -- Дата создания уведомления

---

# Таблица Scenarios

Хранение пользовательских сценариев автоматизации.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор сценария
user_id -- UUID -- FOREIGN KEY -> Users.id -- Создатель сценария
name -- VARCHAR(100) -- Название сценария
description -- TEXT -- Описание сценария
is_enabled -- BOOLEAN -- Включен ли сценарий
created_at -- TIMESTAMP -- Дата создания сценария
updated_at -- TIMESTAMP -- Дата изменения сценария

---

# Таблица ScenarioActions

Хранение действий внутри сценариев.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор действия
scenario_id -- UUID -- FOREIGN KEY -> Scenarios.id -- Сценарий
action_order -- INTEGER -- Порядковый номер действия
action_type -- VARCHAR(50) -- Тип действия
parameters -- JSON -- Параметры действия
created_at -- TIMESTAMP -- Дата создания действия

---

# Таблица Files

Хранение информации о файлах подключенного устройства.

## Поля

id -- UUID -- PRIMARY KEY -- Уникальный идентификатор файла
device_id -- UUID -- FOREIGN KEY -> Devices.id -- Устройство
path -- TEXT -- Путь к файлу
name -- VARCHAR(255) -- Название файла
type -- VARCHAR(50) -- Тип файла
size -- BIGINT -- Размер файла
last_modified -- TIMESTAMP -- Последнее изменение файла
created_at -- TIMESTAMP -- Дата добавления записи

---

# Таблица RemoteConnections

Хранение информации об удаленных подключениях.

## Поля

id -- UUID -- PRIMARY KEY -- Идентификатор подключения
user_id -- UUID -- FOREIGN KEY -> Users.id -- Пользователь
device_id -- UUID -- FOREIGN KEY -> Devices.id -- Устройство
connection_type -- VARCHAR(50) -- Тип подключения
status -- VARCHAR(20) -- Статус подключения
started_at -- TIMESTAMP -- Начало подключения
ended_at -- TIMESTAMP -- Завершение подключения

---

# Таблица Logs

Хранение системных логов Griffitus.

## Поля

id -- UUID -- PRIMARY KEY -- Идентификатор записи
device_id -- UUID -- FOREIGN KEY -> Devices.id -- Устройство
level -- VARCHAR(20) -- Уровень сообщения
message -- TEXT -- Содержание сообщения
created_at -- TIMESTAMP -- Время создания записи

---

# Связи таблиц

Users (1) ---- (N) Devices

Users (1) ---- (N) Sessions

Users (1) ---- (N) Notifications

Users (1) ---- (N) Scenarios

Devices (1) ---- (1) Agent

Devices (1) ---- (1) DeviceMetrics

Devices (1) ---- (N) MonitoringHistory

Devices (1) ---- (N) Commands

Devices (1) ---- (N) Files

Devices (1) ---- (N) Logs

Devices (1) ---- (N) RemoteConnections

Scenarios (1) ---- (N) ScenarioActions.


