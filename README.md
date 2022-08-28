# MGMQ.js

## Mini game maker - Quest

Создание квестов на javascript, либо просто текстом с определителями.

Плюсы:
- Легкий запуск.
Не нужны дополнительные установки, программы, сторонние библиотеки.
- Легкий запуск в интернете.
На хостинге так же не нужно ничего устанавливать, нужно просто разместить html-файл и изображения для квеста.
- Свободное использование javascript.
При желании, можно как угодно расширять возможности: функционал, количество js-файлов со сценарием, подключение стилей и js-библиотек.

Минусы:
- Их нет! (но это не точно)

Может быть добавится в будущем:
- Больше вариантов эффектов для перехода между страницами
- Заготовленные стили цветов
- Читалка голосом, а может и управлялка
- Свой сайт с регистрацией, редактором и публикацией квестов

______

### Примеры

Пример создания квеста с помощью кода - 
[открыть](https://github.com/jkn-code/mgm-quest/blob/main/example_code.html)

Пример создания квеста с помощью текста - 
[открыть](https://github.com/jkn-code/mgm-quest/blob/main/example_text.html)

Пример создания квеста с помощью текста и дополнений в виде кода, а так же через подключение сценария через отдельный файл - 
[открыть](https://github.com/jkn-code/mgm-quest/blob/main/example_file.html)

______

### Правила создания квеста

- Создать html-файл, и теги
- Подключить `MGMQ.js`
- Создать тег скрипта и в нем создать экземпляр класса `MGMQ` с параметрами настройки в переменную `MQ`
- В объект `MQ.text` можно задать текст сценария, который распознается классом
- В объект `MQ.pages` можно создавать объекты страниц
- Запустить html-файл


### Настройки MGMQ

**name** - Название страницы

**icon** - Иконка страницы

**bodyColor** - Фоновый цвет

**textColor** - Цвет текста

**borderColor** - Цвет линий

**start** - Имя первой страницы

Примечания:
- Если `borderColor` не указан, то он берется из `textColor`
- Если `start` не указано, то берется первая по счету страница

### Объекты и поля MQ

**pages** - Объекты страниц

**text** - Текст сценария с определителями

**var** - Переменные квеста, их имена можно указывать в тексте для вывода - `%name%`

**keys** - Ключи квеста





