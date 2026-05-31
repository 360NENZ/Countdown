# 高考倒计时壁纸页

一个适合作为桌面壁纸或公开网页部署的高考倒计时页面，支持北京时间同步、自动年份判断、考试期间科目状态显示、手机端适配和自定义口号。

## 文件结构

```text
.
├─ index.html
└─ fonts/
   └─ MapleMono-NF-CN/
      └─ MapleMono-NF-CN-Regular.ttf
```

页面会优先从 CDN 加载字体：

```text
https://cdn.jsdmirror.cn/gh/360NENZ/Countdown@CollegeEntranceExam/fonts/MapleMono-NF-CN/MapleMono-NF-CN-Regular.ttf
```

如果 CDN 不可用，会回退到本地字体文件。

## 直接使用

打开 `index.html` 即可使用。

默认会从时间代理获取北京时间：

```text
https://time.360nenz.top/time
```

如果代理不可用，页面会自动回退到本地系统时间。

## URL 参数

### 自定义口号

使用 `slogan` 参数：

```text
index.html?slogan=高三6班%20众志成城%20决战高考%20我辈必赢
```

口号显示规则：

- 电脑端：完整单行显示。
- 手机端：
  - 有标点时，按标点分句显示。
  - 无标点且正好 16 字时，按 8 字一行显示。
  - 无标点且包含空格时，按空格分行。

默认口号：

```text
愿你笔锋所至，皆是心之所向
```

### 指定高考年份

使用 `year` 参数：

```text
index.html?year=2027
```

也支持别名：

```text
index.html?gaokaoYear=2027
```

如果不传年份参数，页面会根据当前北京时间自动判断：

- 当前时间在当年高考结束前：使用当年。
- 当前时间已过当年高考结束时间：使用下一年。

### 指定时间代理

使用 `timeProxy` 参数：

```text
index.html?timeProxy=https://time.example.com/time
```

可与其他参数组合：

```text
index.html?year=2027&slogan=高三6班%20众志成城%20决战高考%20我辈必赢&timeProxy=https://time.example.com/time
```

## 时间显示逻辑

页面包含三个阶段：

### 高考开始前

显示距离高考开始的倒计时。

当剩余天数大于 10 天时，倒计时使用暖棕金色；当剩余天数小于等于 10 天时，倒计时自动变红。

### 高考开始后、结束前

显示：

```text
高考已开始
```

并根据当前时间显示：

- 已考完科目
- 当前正在考的科目、起止时间、本科剩余时间
- 两科间隔时显示下一科及其起止时间

### 高考结束后

显示：

```text
高考已结束
愿你前程似锦，得偿所愿。
```

## 默认考试安排

默认按 6 月 7 日至 6 月 9 日安排：

| 日期 | 科目 | 时间 |
| --- | --- | --- |
| 6 月 7 日 | 语文 | 09:00 - 11:30 |
| 6 月 7 日 | 数学 | 15:00 - 17:00 |
| 6 月 8 日 | 物理或历史 | 09:00 - 10:15 |
| 6 月 8 日 | 外语（含听力） | 15:00 - 17:00 |
| 6 月 9 日 | 化学 | 08:30 - 09:45 |
| 6 月 9 日 | 地理 | 11:00 - 12:15 |
| 6 月 9 日 | 思想政治 | 14:30 - 15:45 |
| 6 月 9 日 | 生物 | 17:00 - 18:15 |

开始时间：

```text
6 月 7 日 09:00:00
```

结束时间：

```text
6 月 9 日 18:15:00
```

年份由 URL 参数或自动判断结果决定。

## 时间代理接口

页面默认请求：

```text
GET https://time.360nenz.top/time
```

期望返回格式：

```json
{
  "ok": true,
  "timeMs": 1780200000000,
  "source": "国家授时中心 ntsc.ac.cn"
}
```

其中：

- `ok`：是否成功。
- `timeMs`：标准时间毫秒时间戳。
- `source`：时间来源说明，会显示在页面底部。

## 统计与图标

页面已接入 Umami 统计：

```html
<script defer src="https://umami.360nenz.top/script.js" data-website-id="6759bb37-53f0-434a-91ee-78b226da65b5"></script>
```

页面 favicon：

```text
https://cdn.jsdmirror.cn/gh/360NENZ/HomePage@master/assets/img/favicon.ico
```

## 部署建议

可以直接将仓库内容部署到静态托管服务，例如 GitHub Pages、EdgeOne Pages、Nginx 静态站点等。

如果作为公共页面部署，建议通过 URL 参数传入口号，而不是直接修改源码中的默认口号。

示例：

```text
https://example.com/?year=2027&slogan=高三6班%20众志成城%20决战高考%20我辈必赢
```

## 本地预览

可以直接双击打开 `index.html`，也可以用本地 HTTP 服务：

```bash
python -m http.server 8080
```

然后访问：

```text
http://127.0.0.1:8080/
```

## 注意事项

- 如果时间代理不可用，页面会回退本地系统时间。
- 手机端样式只在窄屏触摸设备上启用，避免桌面端窄窗口误用手机布局。
- 自定义口号最多使用前 80 个字符。
