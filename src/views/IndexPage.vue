<template>
    <div id="indexdiv">
        <!-- OP 视频和控制界面 -->
        <div id="opApp" v-if="GlobeTransmitItems[0].isOpShow">
            <div id="op" v-if="op_show">
                <!-- 视频容器 -->
                <video v-if="op_play" src="../assets/static/index/OP.mp4" autoplay muted></video>
                <div class="overlay" @click="toggle" :class="{ 'animate-fade2': isAnimating2 }"></div>
            </div>
            <!-- 遮罩层动画容器 -->
            <div v-show="showOverlay" class="transition-overlay" :class="{ 'animate-fade1': isAnimating1 }"></div>

        </div>

        <!--主界面-->
        <div id="main">
            <div class="bg-container">
                <!-- 背景底图 -->
                <img src="../assets/static/index/bg.png" class="bg-img">
                <!-- ch1 ~ ch4 动画层 -->
                <transition name="fade-up">
                    <img v-if="showCh1" :style="ch1Style" src="../assets/static/index/ch1.png" class="ch-img ch1">
                </transition>
                <transition name="fade-right">
                    <img v-if="showCh2" :style="ch2Style" src="../assets/static/index/ch2.png" class="ch-img ch2">
                </transition>
                <transition name="fade-left">
                    <img v-if="showCh3" :style="ch3Style" src="../assets/static/index/ch3.png" class="ch-img ch3">
                </transition>
                <transition name="fade-diag">
                    <img v-if="showCh4" :style="ch4Style" src="../assets/static/index/ch4.png" class="ch-img ch4">
                </transition>
            </div>
            <div class="content-overlay">
                <transition name="fade-in-left">
                    <div class="left-white-mask" v-if="action2"></div>
                </transition>
                <transition name="fade-in-left">
                    <img src="../assets/static/index/side.png" class="side-img" v-if="action">
                </transition>
                <div id="game-logo"><img src="../assets/static/index/2170.png" style="width: 60%;padding: 6vh;"></div>
                <div id="buttonApp">
                    <transition name="fade-in-left">
                        <div class="button-column" v-if="action">
                            <img v-for="(_, index) in baseImages" :key="index" :src="img(index)" class="button-index"
                                :style="getButtonStyle(index)" @mouseover="handleMouseOver(index)"
                                @mouseout="handleMouseOut(index)" @mousedown="handleMouseDown(index)"
                                @mouseup="handleMouseUp(index)" @click="handleButtonClick(index)">
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import '../assets/js/fullscreen.js';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import eventBus from '../components/event-bus.js';
import { useDataStore } from '../components/dataStore.js';

// 资源路径常量
const link = 'src/assets/static/index/';
const sound = 'src/assets/static/sound/';

// 路由和状态管理
const router = useRouter();
const dataStore = useDataStore();
const { GlobeTransmitItems } = storeToRefs(dataStore);

// OP动画状态
const op_play = ref(false);
const op_load = ref(0);
const showOverlay = ref(false);
const isAnimating1 = ref(false);
const isAnimating2 = ref(false);
const op_show = ref(true);

// 主界面动画状态
const action = ref(false);
const action2 = ref(false);
const showCh1 = ref(false);
const showCh2 = ref(false);
const showCh3 = ref(false);
const showCh4 = ref(false);

// 按钮状态
const hoveredIndex = ref(-1);
const selectedIndex = ref(-1);

// 角色位置样式
const ch1Style = ref({ top: '40px', left: '450px', width: '900px', height: 'auto' });
const ch2Style = ref({ top: '90px', left: '140px', width: '1000px', height: 'auto' });
const ch3Style = ref({ top: '350px', left: '800px', width: '1000px', height: 'auto' });
const ch4Style = ref({ top: '20px', left: '950px', width: '800px', height: 'auto' });

// 按钮资源
const baseImages = [
    link + '2285.png', link + '2282.png', link + '2279.png',
    link + '2276.png', link + '2273.png', link + '2270.png'
];
const hoverImages = [
    link + '2052.png', link + '2073.png', link + '2087.png',
    link + '2101.png', link + '2155.png', link + '2169.png'
];
const activeImages = [
    link + '2059.png', link + '2066.png', link + '2080.png',
    link + '2094.png', link + '2148.png', link + '2162.png'
];

// 按钮样式映射
const buttonStyles = [
    { 'margin-left': '-1vh' },
    { 'margin-left': '-2vh' },
    { 'margin-left': '7vh' },
    { 'margin-left': '2vh' },
    {},
    {}
];

// 按钮点击处理
const handleButtonClick = (index) => {
    switch (index) {
        case 0:
            goToDialog();
            GlobeTransmitItems.value[0].isInDialog=1;
            break;
        case 1:
            goToLoaddata();
            break;
    }
};

// 路由跳转
const goToLoaddata = () => {
    eventBus.$emit('set-voice', sound + 'load.ogg');
    router.push({ name: 'Loaddata' });
};

const goToDialog = () => {
    router.push({ name: 'Dialog' });
};

// 按钮交互方法
const handleMouseOver = (index) => {
    eventBus.$emit('set-sound1', sound + 'buttonhover.ogg');
    if (index !== selectedIndex.value) {
        hoveredIndex.value = index;
    }
};

const handleMouseOut = (index) => {
    if (index !== selectedIndex.value) {
        hoveredIndex.value = -1;
    }
};

const handleMouseDown = (index) => {
    eventBus.$emit('set-sound2', sound + 'buttonclick.ogg');
    selectedIndex.value = index;
};

const handleMouseUp = (index) => {
    selectedIndex.value = -1;
};

const img = (index) => {
    if (index === selectedIndex.value) return activeImages[index];
    if (index === hoveredIndex.value) return hoverImages[index];
    return baseImages[index];
};

const getButtonStyle = (index) => buttonStyles[index];

// OP动画控制
const toggle = () => {
    op_load.value++;
    if (op_load.value === 1) {
        op_play.value = true;
        setTimeout(() => eventBus.$emit('set-voice', sound + 'yuzu.ogg'), 2800);
        setTimeout(() => eventBus.$emit('set-bgm', sound + 'SongOp.ogg'), 8600);
        setTimeout(() => isAnimating2.value = true, 2000);
    } else if (op_load.value === 2) {
        triggerOverlayAnimation();
    }
};

const triggerOverlayAnimation = () => {
    setTimeout(() => GlobeTransmitItems.value[0].isOpShow = false, 3000);
    showOverlay.value = true;
    setTimeout(() => {
        isAnimating1.value = true;
        setTimeout(() => op_show.value = false, 700);
        setTimeout(() => eventBus.$emit('set-voice', sound + 'serenbanka.ogg'), 400);
        setTimeout(() => {
            showOverlay.value = false;
            isAnimating1.value = false;
            // 依次显示角色
            setTimeout(() => showCh1.value = true, 200);
            setTimeout(() => showCh2.value = true, 400);
            setTimeout(() => showCh3.value = true, 600);
            setTimeout(() => showCh4.value = true, 800);
            setTimeout(() => { action2.value = true; }, 1000)
            setTimeout(() => { action.value = true; }, 1800)
        }, 2000);
    }, 10);
};

// 生命周期
onMounted(() => {
    // 非首次进入（从其他页面返回）时直接显示内容
    if (!GlobeTransmitItems.value[0].isOpShow) {
        setTimeout(() => action2.value = true, 500);
        setTimeout(() => action.value = true, 900);
        showCh1.value = true;
        setTimeout(() => showCh2.value = true, 100);
        setTimeout(() => showCh3.value = true, 200);
        setTimeout(() => showCh4.value = true, 300);
    }
});
</script>


<style scoped>
@import '../assets/css/index.css';
</style>
