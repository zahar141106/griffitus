# Griffitus API

Версия API: v1

---

# Authentication API
## Регистрация пользователя
Создание нового аккаунта Griffitus.
Endpoint: POST /api/v1/auth/register
Request:
{
    "username": "username",
    "email": "user@mail.com",
    "password": "password"
}
Response:
{
    "message": "User created successfully"
}

---

## Авторизация пользователя
Endpoint: POST /api/v1/auth/login
Request:
{
    "login": "username/email",
    "password": "password"
}
Response:

{
    "access_token": "JWT_TOKEN",
    "refresh_token": "REFRESH_TOKEN",
    "two_factor_required": true
}

---

## Подтверждение 2FA
Endpoint: POST /api/v1/auth/verify-2fa

Request:
{
    "user_id": "UUID",
    "code": "123456"
}
Response:
{
    "message": "Authentication successful"
}

---

## Выход из аккаунта
Endpoint: POST /api/v1/auth/logout

---

# User API
## Получение профиля пользователя
GET /api/v1/users/profile
Response:
{
    "username": "user",
    "email": "mail@example.com",
    "avatar": "url"
}

---

## Изменение профиля
PATCH /api/v1/users/profile
Request:
{
    "username": "new_username",
    "avatar": "url"
}

---

# Device API
## Получение списка устройств
GET /api/v1/devices
Response:
[
    {
        "id":"UUID",
        "device_name":"Desktop 2938",
        "status":"online",
        "os":"Windows 11"
    }
]

---

## Получение информации об устройстве
GET /api/v1/devices/{device_id}
Response:
{
    "device_name":"Desktop 2938",
    "status":"online",
    "agent_version":"1.0.0",
    "last_seen":"timestamp"
}

---

## Добавление устройства через QR
POST /api/v1/devices/connect
Request:
{
    "qr_token":"UUID"
}
Response:
{
    "device_id":"UUID",
    "message":"Device connected"
}

---

## Удаление устройства
DELETE /api/v1/devices/{device_id}

---

# Monitoring API
## Получение текущего состояния устройства
GET /api/v1/devices/{device_id}/metrics
Response:
{
    "cpu":35,
    "ram":60,
    "disk":45,
    "network":20,
    "temperature":55
}

---

## Получение истории мониторинга
GET /api/v1/devices/{device_id}/monitoring/history
Parameters:
period:
- hour
- day
- week
- month

Response:
[
    {
        "cpu":30,
        "ram":50,
        "created_at":"timestamp"
    }
]

---

# Commands API
## Отправка команды устройству
POST /api/v1/devices/{device_id}/commands
Request:
{
    "command_type":"shutdown"
}
Доступные команды:
shutdown
restart
sleep
wake
lock
execute

Response:
{
    "command_id":"UUID",
    "status":"pending"
}

---

## История команд
GET /api/v1/devices/{device_id}/commands
Response:
[
    {
        "command":"shutdown",
        "status":"completed",
        "created_at":"timestamp"
    }
]

---

# Files API
## Получение файлов устройства
GET /api/v1/devices/{device_id}/files
Response:
[
    {
        "name":"document.pdf",
        "path":"C:/Users/User",
        "size":1024
    }
]

---

## Скачать файл
GET /api/v1/devices/{device_id}/files/download
Request:

{
    "path":"C:/file.txt"
}

---

## Удалить файл
DELETE /api/v1/devices/{device_id}/files

---

# Remote Connection API
## Создание удаленного подключения
POST /api/v1/devices/{device_id}/connect
Response:
{
    "connection_id":"UUID",
    "status":"connecting"
}
---

## Завершение подключения
POST /api/v1/connections/{connection_id}/disconnect

---

# Scenario API
## Создание сценария

POST /api/v1/scenarios
Request:
{
    "name":"Night Mode",
    "description":"Выключение компьютера ночью"
}

---

## Получение сценариев
GET /api/v1/scenarios

---

## Добавление действия в сценарий
POST /api/v1/scenarios/{scenario_id}/actions
Request:
{
    "action_type":"shutdown",
    "parameters":{}
}

---

## Запуск сценария
POST /api/v1/scenarios/{scenario_id}/execute

---

# Notification API
## Получение уведомлений
GET /api/v1/notifications

---

## Отметить уведомление прочитанным
PATCH /api/v1/notifications/{id}/read

---

# Agent WebSocket API
Используется для постоянного соединения Griffitus Agent с сервером.

## Подключение агента
Event: agent.connect
Data:
{
    "device_id":"UUID,
    "agent_version":"1.0"
}

---

## Отправка состояния устройства
Event: agent.metrics
Data:
{
    "cpu":30,
    "ram":50
}

---

## Получение команды агентом
Event: command.execute
Data:
{
    "command":"shutdown"
}

---

## Ответ агента
Event: command.result
Data:
{
    "command_id":"UUID",
    "status":"completed"
}

---

# Безопасность API
Используется:

- HTTPS
- JWT Authentication
- Refresh Tokens
- Password Hashing
- Two Factor Authentication
- Device PIN
- QR Device Pairing
- Secure WebSocket Connection