---
id: calculate-video-duration
title: 计算视频时长
sidebar_label: 计算视频时长
---

想要获取视频时长，我们需要从以下几点入手：

- 首先创建 video 元素
- 监听 loadedmetadata 事件，可以解析出视频的所有元信息，包括时长
- 设定 video 元素的 src
- 监听错误事件
- 清除监听

大致实现可以参考：

```typescript
const video: HTMLVideoElement = document.createElement('video');
const url = window.URL.createObjectURL(file);

// 视频loadedmetadata事件处理器
const handleLoaded = () => {
  console.log('视频时长是', video.duration);
  cleanup();
};

// 视频加载错误处理器
const handleError = (event: ErrorEvent) => {
  console.log('计算视频时长失败', error);
  cleanup();
};

// 取消的监听并移除元素
const cleanup = () => {
  video.removeEventListener('loadedmetadata', handleLoaded, false);
  video.removeEventListener('error', handleError, false);
  video.remove();
  window.URL.revokeObjectURL(url);
};

// 监听loadedmetadata事件
video.addEventListener('loadedmetadata', handleLoaded, false);
// 监听错误事件
video.addEventListener('error', handleError, false);
// 设定src
video.src = url;
```
