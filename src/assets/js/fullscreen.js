document.addEventListener('click', async function fullscreenHandler(event) {
    try {
        // 只在首次点击时请求全屏
        document.removeEventListener('click', fullscreenHandler);

        // 请求全屏（使用整个页面的根元素）
        const element = document.documentElement;
        if (element.requestFullscreen) {
            await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            await element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            await element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            await element.msRequestFullscreen();
        } else {
            alert('您的浏览器不支持全屏功能');
        }
    } catch (error) {
        console.error('全屏请求被拒绝:', error);
        alert('请允许浏览器全屏显示');
    }
});
