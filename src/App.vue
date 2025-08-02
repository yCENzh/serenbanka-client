<template>
  <div class="full-screen-cursor">
 
      <router-view v-slot="{ Component }">
        <transition name="app-fade">
          <component :is="Component"></component>
        </transition>
      </router-view>

    <audio ref="audio1Ref" :src="audioStore.sound1" preload="auto"></audio>
    <audio ref="audio2Ref" :src="audioStore.sound2" preload="auto"></audio>
    <audio ref="audio3Ref" :src="audioStore.voice" preload="auto"></audio>
    <audio ref="audio4Ref" :src="audioStore.bgm" preload="auto" loop></audio>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useDataStore, useAudioStore } from '../src/components/dataStore.js';



const dataStore = useDataStore();
const audioStore = useAudioStore();


onMounted(async () => {
  try {
    await dataStore.fetchSaveItems(); // 应用启动时预加载数据
    await dataStore.fetchDialogItems(); // 应用启动时预加载数据
    await dataStore.fetchJumpItems(); // 应用启动时预加载数据
    console.log(dataStore.GlobeTransmitItems)
  } catch (error) {
    console.error('数据加载失败:', error);

  }
});


const audio1Ref = ref(null);
const audio2Ref = ref(null);
const audio3Ref = ref(null);
const audio4Ref = ref(null);

onMounted(() => {
  // 将DOM元素的ref赋值给store中的对应属性
  audioStore.audio1 = audio1Ref.value;
  audioStore.audio2 = audio2Ref.value;
  audioStore.audio3 = audio3Ref.value;
  audioStore.audio4 = audio4Ref.value;

  console.log('音频引用已初始化:', {
    audio1: audioStore.audio1,
    audio2: audioStore.audio2,
    audio3: audioStore.audio3,
    audio4: audioStore.audio4
  });
});
</script>



<style>
.app-fade-enter-active {
  transition: opacity 1s ease;
  position: absolute;
  width: 100%;
  opacity: 0;
}

.app-fade-leave-active {
  transition: opacity 1s ease;
  position: absolute;
  width: 100%;
}

.app-fade-enter,
.app-fade-leave-to {
  opacity: 0;
}

.app-fade-enter-to,
.app-fade-leave {
  opacity: 1;
}
</style>
