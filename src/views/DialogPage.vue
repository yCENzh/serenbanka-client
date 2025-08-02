<template>
  <!-- 主容器 -->
  <div id="dialog-main" @click="handleMainClick" @wheel="handleMainWheel">
    <!-- 章节图片 -->
    <transition name="fade">
      <div id="currentchapter" v-if="!showReadLog">{{ currentDialog.chapter }}</div>
    </transition>
    
    <!-- 遮罩层 -->
    <div id="transition-mask"></div>
    
    <!-- 场景背景 -->
    <img id="scene-bg" :src="backgroundImage" alt="场景图" />
    
    <!-- 角色立绘区域 -->
    <div class="character-area">
      <!-- 左侧角色 -->
      <div class="character-slot left">
        <transition name="character-fade">
          <div v-if="leftCharacter" :key="leftCharacterKey" :class="leftCharacter" class="character-fade-root">
            <div v-if="leftPoseType === 'a'" :class="['body-a', `pose-${leftPose}`]" />
            <div v-else :class="['body-b', `pose-${leftPose}`]" />
            <div v-if="leftPoseType === 'a'" :class="['face-a', `expression-${leftFace}`, { active: true }]" />
            <div v-else :class="['face-b', `expression-${leftFace}`, { active: true }]" />
          </div>
        </transition>
      </div>
      
      <!-- 中间角色 -->
      <div class="character-slot center">
        <transition name="character-fade">
          <div v-if="middleCharacter" :key="middleCharacterKey" :class="middleCharacter" class="character-fade-root">
            <div v-if="middlePoseType === 'a'" :class="['body-a', `pose-${middlePose}`]" />
            <div v-else :class="['body-b', `pose-${middlePose}`]" />
            <div v-if="middlePoseType === 'a'" :class="['face-a', `expression-${middleFace}`, { active: true }]" />
            <div v-else :class="['face-b', `expression-${middleFace}`, { active: true }]" />
          </div>
        </transition>
      </div>
      
      <!-- 右侧角色 -->
      <div class="character-slot right">
        <transition name="character-fade">
          <div v-if="rightCharacter" :key="rightCharacterKey" :class="rightCharacter" class="character-fade-root">
            <div v-if="rightPoseType === 'a'" :class="['body-a', `pose-${rightPose}`]" />
            <div v-else :class="['body-b', `pose-${rightPose}`]" />
            <div v-if="rightPoseType === 'a'" :class="['face-a', `expression-${rightFace}`, { active: true }]" />
            <div v-else :class="['face-b', `expression-${rightFace}`, { active: true }]" />
          </div>
        </transition>
      </div>
    </div>
    
    <!-- 对话框 -->
    <div id="dialog-box" v-show="isDialogVisible">
      <!-- 对话框背景 -->
      <img id="dialog-box-bg" src="../assets/static/dialog/349.png" alt="对话框底图" />
      
      <!-- 对话框内容 -->
      <div id="dialog-content">
        <div id="dialog-row">
          <!-- 对话框头像 -->
          <div id="dialog-avatar">
            <div v-if="dialogAvatarCharacter" :class="dialogAvatarCharacter">
              <div v-if="dialogAvatarPoseType === 'a'" :class="['body-a', `pose-${dialogAvatarPose}`]"></div>
              <div v-else :class="['body-b', `pose-${dialogAvatarPose}`]"></div>
              <div v-if="dialogAvatarPoseType === 'a'" :class="['face-a', `expression-${dialogAvatarFace}`, { active: true }]"></div>
              <div v-else :class="['face-b', `expression-${dialogAvatarFace}`, { active: true }]"></div>
            </div>
          </div>
          
          <!-- 对话框文本 -->
          <div id="dialog-maintext">
            <div id="name">{{ currentDialogName }}</div>
            <div id="text">
              <span v-for="(line, lineIndex) in displayedLines" :key="lineIndex" class="text-line">
                <span v-for="(char, charIndex) in line" :key="charIndex" class="text-char">{{ char }}</span>
                <br v-if="lineIndex < displayedLines.length - 1">
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 按钮区域 -->
      <div id="button-area" ref="buttonAreaRef" :class="{
        'fixed': isButtonBarFixed,
        'hovered': isButtonBarHovered,
        'volume-active': showVolumeControl
      }" @mouseenter="handleButtonBarMouseEnter" @mouseleave="handleButtonBarMouseLeave">
        <!-- 按钮栏分割线 -->
        <img id="button-bar-line" src="../assets/static/dialog/11557.png" alt="按钮区分割线" />
        
        <!-- 按钮栏 -->
        <div id="button-bar">
          <img v-for="(src, idx) in baseImages" :key="idx" :src="img(idx)" class="dialog-btn"
            @mouseover="handleMouseOver(idx)" @mouseout="handleMouseOut(idx)" @mousedown="handleMouseDown(idx)"
            @mouseup="handleMouseUp(idx)" @click.stop="handleClick(idx)" />
        </div>
        
        <!-- 功能说明区域 -->
        <div id="function-tip" :class="{ show: hoveredIndex !== -1 }">
          <img src="../assets/static/dialog/11560.png" alt="功能说明底图" />
          <div class="tip-text">{{ getFunctionTipText() }}</div>
        </div>
      </div>
      
      <!-- 音量控制 -->
      <div id="volume-control" v-show="showVolumeControl" @click.stop>
        <div id="volume-slider-container">
          <div id="volume-slider-track">
            <div id="volume-slider" :style="{ bottom: volume + '%' }" @mousedown="startDragging"></div>
            </div>
          </div>
        </div>
      </div>
    
    <!-- 已读界面 -->
    <transition name="fade">
      <div id="read-log" v-show="showReadLog">
        <!-- 已读界面标题 -->
        <img class="read-title" src="../assets/static/dialog/readlog/backlog.png" alt="文本回想" />
        
        <!-- 滚动按钮 -->
        <button class="scroll-btn scroll-btn-up" @mouseenter="handleScrollBtnHover" @click.stop="handleScrollBtnClick('up')" alt="向上一条" />
        <button class="scroll-btn scroll-btn-top" @mouseenter="handleScrollBtnHover" @click.stop="handleScrollBtnClick('top')" alt="到顶部" />
        
        <!-- 日志列表 -->
        <div class="log-list" ref="logList" @wheel.prevent="handleWheel">
          <div v-for="(item, idx) in (GlobeTransmitItems[0]?.readLogList || [])" :key="idx" class="log-item" @mouseenter="handleReadLogItemHover">
            <div class="log-name">{{ item.name }}</div>
            <div class="log-text">{{ item.text }}</div>
          </div>
        </div>
        
        <!-- 滚动条控制器 -->
        <div id="scroll-control" @click.stop>
          <div id="scroll-slider-container">
            <div id="scroll-slider-track">
              <div id="scroll-slider" :style="{ top: scrollPosition + '%' }" @mousedown.stop="startDraggingScroll"></div>
              </div>
            </div>
          </div>
        
        <!-- 滚动按钮 -->
        <button class="scroll-btn scroll-btn-down" @mouseenter="handleScrollBtnHover" @click.stop="handleScrollBtnClick('down')" alt="向下一条" />
        <button class="scroll-btn scroll-btn-bottom" @mouseenter="handleScrollBtnHover" @click.stop="handleScrollBtnClick('bottom')" alt="到底部" />
        <button class="back-btn" @mouseenter="handleBackBtnHover" @click.stop="handleBackBtnClick"></button>
      </div>
    </transition>
    
    <!-- 选项界面 -->
    <transition name="fade">
      <div id="option-log" v-if="currentDialog && currentDialog.jump > 0">
        <button id="optionButton1" class="option-button" @mouseenter="handleOptionHover" @click="handleOptionClick(0)">
          {{ currentJump?.optionText1 || '默认文案' }}
        </button>
        <button id="optionButton2" class="option-button" @mouseenter="handleOptionHover" @click="handleOptionClick(1)">
          {{ currentJump?.optionText2 || '默认文案' }}
        </button>
        <div id="option"></div>
      </div>
    </transition>
  </div>
</template>

<script setup>
// ========== 导入依赖 ==========
import { ref, onMounted, watch, onUnmounted, nextTick, computed } from 'vue';
import eventBus from '../components/event-bus.js';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useDataStore } from '../components/dataStore.js';

// ========== 数据存储 ==========
const dataStore = useDataStore();
const { DialogItems } = storeToRefs(dataStore);
const { GlobeTransmitItems } = storeToRefs(dataStore);
const { JumpItems } = storeToRefs(dataStore);

// ========== 常量定义 ==========
const ASSET_PATHS = {
  DIALOG: 'src/assets/static/dialog/',
  SOUND: 'src/assets/static/sound/',
  BGM: 'src/assets/static/bgm/'
};

const FUNCTION_TIP_TEXTS = [
  '固定 / 解除', '自定义', '保存', '加载', '快速保存',
  '快速加载', '系统', '上一分支', '前移场景', '快退',
  '上一句', '已读界面', '自动', '快进', '下一场景',
  '下一分支', '流程图', '音量调节', '重放当前音频',
  '语音收藏', '隐藏界面'
];

const FUNCTION_SOUND_PATHS = [
  '切替1.ogg', '切替2.ogg', '切替2.ogg', '切替2.ogg', '切替2.ogg',
  '切替2.ogg', '切替2.ogg', '切替2.ogg', '切替2.ogg', '切替1.ogg',
  '切替2.ogg', '切替2.ogg', '切替1.ogg', '切替1.ogg', '切替2.ogg',
  '切替2.ogg', '切替2.ogg', '切替1.ogg', '切替2.ogg', '切替2.ogg',
  '切替2.ogg'
];

const CHARACTER_MAP = {
  0: 'character-congyu',
  1: 'character-fangnai',
  // 可以继续添加更多角色
};

// ========== 响应式状态 ==========
// 界面状态
const isDialogVisible = ref(true);
const showReadLog = ref(false);
const showVolumeControl = ref(false);
const isButtonBarHovered = ref(false);
const buttonAreaRef = ref(null);

// 按钮状态
const hoveredIndex = ref(-1);
const selectedIndex = ref(-1);
const isDragging = ref(false);

// 滚动相关状态
const logList = ref(null);
const scrollPosition = ref(0);
const isDraggingScroll = ref(false);

// 打字机效果状态
const displayedLines = ref([]);
const isTyping = ref(false);
const typingSpeed = ref(50); // 打字速度（毫秒/字符）
const typingTimer = ref(null);

const currentBGM = ref(null);

// ========== 计算属性 ==========
// 当前对话内容
const currentDialog = computed(() => {
  if (!GlobeTransmitItems.value || GlobeTransmitItems.value.length === 0) {
    return null;
  }
  const dialog = DialogItems.value.find(item => item.plot_id === GlobeTransmitItems.value[0].currentPlotId);
  return dialog ? dialog : null;
});

// 当前对话名称
const currentDialogName = computed(() => {
  return currentDialog.value ? currentDialog.value.sayingpeople : '【 芦花 】';
});

// 背景图片
const backgroundImage = computed(() => {
  const bgName = currentDialog.value && currentDialog.value.background ? currentDialog.value.background : '街_绿植A.png';
  return `/src/assets/static/bgimage/${bgName}`;
});

// 选项跳转
const currentJump = computed(() => {
  if (!currentDialog.value) return null;
  const jumpItem = JumpItems.value.find(item => item.jump === currentDialog.value.jump);
  return jumpItem ? jumpItem : null;
});

// 左侧角色状态
const leftCharacter = computed(() => {
  return currentDialog.value && currentDialog.value.left_people !== "" ? CHARACTER_MAP[currentDialog.value.left_people] : null;
});

const leftPoseType = computed(() => {
  return currentDialog.value && currentDialog.value.left_pose_type ? currentDialog.value.left_pose_type : 'a';
});

const leftPose = computed(() => {
  return currentDialog.value && currentDialog.value.left_pose ? currentDialog.value.left_pose : '0';
});

const leftFace = computed(() => {
  return currentDialog.value && currentDialog.value.left_face !== undefined ? currentDialog.value.left_face : 'normal';
});

// 中间角色状态
const middleCharacter = computed(() => {
  return currentDialog.value && currentDialog.value.middle_people !== "" ? CHARACTER_MAP[currentDialog.value.middle_people] : null;
});

const middlePoseType = computed(() => {
  return currentDialog.value && currentDialog.value.middle_pose_type ? currentDialog.value.middle_pose_type : 'a';
});

const middlePose = computed(() => {
  return currentDialog.value && currentDialog.value.middle_pose ? currentDialog.value.middle_pose : '0';
});

const middleFace = computed(() => {
  return currentDialog.value && currentDialog.value.middle_face !== undefined ? currentDialog.value.middle_face : 'normal';
});

// 右侧角色状态
const rightCharacter = computed(() => {
  return currentDialog.value && currentDialog.value.right_people !== "" ? CHARACTER_MAP[currentDialog.value.right_people] : null;
});

const rightPoseType = computed(() => {
  return currentDialog.value && currentDialog.value.right_pose_type ? currentDialog.value.right_pose_type : 'a';
});

const rightPose = computed(() => {
  return currentDialog.value && currentDialog.value.right_pose ? currentDialog.value.right_pose : '0';
});

const rightFace = computed(() => {
  return currentDialog.value && currentDialog.value.right_face !== undefined ? currentDialog.value.right_face : 'normal';
});

// 对话框头像角色状态
const dialogAvatarCharacter = computed(() => {
  return currentDialog.value && currentDialog.value.read_people !== "" ? CHARACTER_MAP[currentDialog.value.read_people] : null;
});

const dialogAvatarPoseType = computed(() => {
  return currentDialog.value && currentDialog.value.read_pose_type ? currentDialog.value.read_pose_type : 'a';
});

const dialogAvatarPose = computed(() => {
  return currentDialog.value && currentDialog.value.read_pose ? currentDialog.value.read_pose : '0';
});

const dialogAvatarFace = computed(() => {
  return currentDialog.value && currentDialog.value.read_face !== undefined ? currentDialog.value.read_face : 'normal';
});

// ========== 资源列表 ==========
const baseImages = Array.from({ length: 21 }, (_, i) => ASSET_PATHS.DIALOG + `baseImages/${i + 1}.png`);
const hoverImages = Array.from({ length: 21 }, (_, i) => ASSET_PATHS.DIALOG + `hoverImages/${i + 1}.png`);
const activeImages = Array.from({ length: 21 }, (_, i) => ASSET_PATHS.DIALOG + `activeImages/${i + 1}.png`);

// ========== 生命周期钩子 ==========
onMounted(async () => {
  
  // 添加鼠标移动监听
  window.addEventListener('mousemove', handleMouseMove);

  // 初始化已读记录和BGM
  if (GlobeTransmitItems.value[0] && DialogItems.value.length > 0) {
    const currentPlotId = GlobeTransmitItems.value[0].currentPlotId;
    const initialDialog = DialogItems.value.find(item => item.plot_id === currentPlotId);
    GlobeTransmitItems.value[0].currentBackground = initialDialog.background;
    GlobeTransmitItems.value[0].currentChapter = initialDialog.chapter;
    
    console.log('Initializing with dialog:', {
      plotId: currentPlotId,
      music: initialDialog?.music
    });
    
    if (initialDialog) {
      // 设置初始BGM
      nextTick(() => {
        handleBGM(initialDialog.music);
      });
      
      // 播放初始语音
      if (initialDialog.voice) {
        eventBus.$emit('set-voice', ASSET_PATHS.SOUND + initialDialog.voice + '.ogg');
      }
      
      // 添加到已读列表
      if (!GlobeTransmitItems.value[0].readLogList.some(
        item => item.text === initialDialog.text
      )) {
        GlobeTransmitItems.value[0].readLogList.push({
          name: initialDialog.sayingpeople,
          text: initialDialog.text
        });
      }
    }
  }
  
  // 初始化打字机效果
  if (currentDialog.value) {
    startTyping(currentDialog.value.text);
  }
});

onUnmounted(() => {
  window.removeEventListener('wheel', handleWheel);
  window.removeEventListener('mousemove', handleMouseMove);
  
  // 清理打字机定时器
  if (typingTimer.value) {
    clearTimeout(typingTimer.value);
  }
});

// ========== 监听器 ==========
// 监听对话内容变化
watch(currentDialog, (newVal) => {
  if (newVal && GlobeTransmitItems.value[0] && !GlobeTransmitItems.value[0].readLogList.some(item => item.text === newVal.text)) {
    if (currentDialog.value) {
      GlobeTransmitItems.value[0].readLogList.push({
        name: currentDialog.value.sayingpeople,
        text: currentDialog.value.text
      });
    }
  }
  
  // 启动打字机效果
  if (newVal) {
    startTyping(newVal.text);
  }
});

// 监听已读页面显示
watch(showReadLog, (val) => {
  if (!val) {
    window.removeEventListener('wheel', handleWheel);
  } else {
    eventBus.$emit('set-voice', ASSET_PATHS.SOUND + 'backlog.ogg');
    nextTick(() => {
      if (logList.value) {
        const { scrollHeight, clientHeight } = logList.value;
        const maxScroll = scrollHeight - clientHeight;
        logList.value.scrollTop = maxScroll;
        scrollPosition.value = 100;
      }
    });
  }
});

// ========== 主界面事件处理 ==========
// 主界面点击处理
const handleMainClick = (event) => {
  // 如果对话框和已读界面都不可见，则显示对话框
  if (!isDialogVisible.value && !showReadLog.value) {
    isDialogVisible.value = true;
  }
  // 如果对话框可见，则切换到下一个对话
  else if (isDialogVisible.value && currentDialog.value && currentDialog.value.jump < 0 && currentDialog.value.isto < 0) {
    // 如果正在打字，先跳过打字效果
    if (isCurrentlyTyping()) {
      skipTyping();
      return;
    }
    
    // 获取下一个 plot_id
    const nextPlotId = GlobeTransmitItems.value[0].currentPlotId + 1;
    // 检查是否存在下一个对话
    const nextDialog = dataStore.DialogItems.find(item => item.plot_id === nextPlotId);
    if (nextDialog) {
      handleDialogChange(nextPlotId);
    }
  } else if (currentDialog.value && currentDialog.value.isto > 0) {
    const nextDialog = dataStore.DialogItems.find(item => item.plot_id === currentDialog.value.isto);
    if (nextDialog) {
      handleDialogChange(currentDialog.value.isto);
    }
  }
};

// 主界面滚轮处理
const handleMainWheel = (event) => {
  if (!isDialogVisible.value) return;

  if (event.deltaY < 0) {
    eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + '切替2.ogg');
    isDialogVisible.value = false;
    showReadLog.value = true;
    setTimeout(() => {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }, 300);
  }
};

// ========== 按钮事件处理 ==========
// 鼠标事件处理
const handleMouseOver = (index) => {
  if (index === 0 && isButtonBarFixed.value) {
    hoveredIndex.value = index;
  } else if (index !== selectedIndex.value) {
    hoveredIndex.value = index;
  }
};

const handleMouseOut = (index) => {
  if (index === 0 && isButtonBarFixed.value) {
    hoveredIndex.value = -1;
  } else if (index !== selectedIndex.value) {
    hoveredIndex.value = -1;
  }
};

const handleMouseDown = (index) => {
  selectedIndex.value = index;
};

const handleMouseUp = (index) => {
  selectedIndex.value = -1;
};

// 按钮点击处理
const handleClick = (index) => {
  // 18为"重放当前音频"按钮，无音效
  if (index !== 18) {
    const soundFile = FUNCTION_SOUND_PATHS[index] || 'buttonclick.ogg';
    eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + soundFile);
  }

  switch (index) {
    case 0: // 固定/解除
      isButtonBarFixed.value = !isButtonBarFixed.value;
      break;
    case 2: // 保存
      eventBus.$emit('set-voice', ASSET_PATHS.SOUND + 'save.ogg');
      GlobeTransmitItems.value[0].isInDialog = 1;
      router.push({ name: 'Savedata' });
      break;
    case 3: // 加载
      eventBus.$emit('set-voice', ASSET_PATHS.SOUND + 'load.ogg');
      GlobeTransmitItems.value[0].isInDialog = 1;
      router.push({ name: 'Loaddata' });
      break;
    case 6: // 系统
      GlobeTransmitItems.value[0].isInDialog = 0;
      GlobeTransmitItems.value[0].isOpShow = false;
      setTimeout(() => eventBus.$emit('set-voice', 'src/assets/static/sound/serenbanka.ogg'), 400);
      setTimeout(() => eventBus.$emit('set-bgm', 'src/assets/static/sound/SongOp.ogg'), 400);
      router.push({ name: 'Index' });
      break;
    case 10: // 上一句
      handlePreviousDialog();
      break;
    case 11: // 已读界面
      isDialogVisible.value = false;
      showReadLog.value = true;
      break;
    case 17: // 音量调节
      handleVolumeButtonClick();
      break;
    case 18: // 重放当前音频
      if (currentDialog.value && currentDialog.value.voice) {
        eventBus.$emit('set-voice', ASSET_PATHS.SOUND + currentDialog.value.voice + '.ogg');
      }
      break;
    case 20: // 隐藏界面
      isDialogVisible.value = !isDialogVisible.value;
      break;
  }
};

// 按钮区鼠标事件处理
const handleButtonBarMouseEnter = () => {
  isButtonBarHovered.value = true;
};

const handleButtonBarMouseLeave = () => {
  if (!isButtonBarFixed.value) {
    isButtonBarHovered.value = false;
  }
};

// 鼠标移动监听
const handleMouseMove = (event) => {
  if (isButtonBarFixed.value || !buttonAreaRef.value) return;

  const buttonArea = buttonAreaRef.value;
  const rect = buttonArea.getBoundingClientRect();

  const triggerArea = {
    top: rect.top - 20,
    bottom: rect.bottom + 20,
    left: rect.left,
    right: rect.right
  };

  if (event.clientY >= triggerArea.top &&
    event.clientY <= triggerArea.bottom &&
    event.clientX >= triggerArea.left &&
    event.clientX <= triggerArea.right) {
    isButtonBarHovered.value = true;
  } else {
    isButtonBarHovered.value = false;
  }
};

// ========== 音量控制 ==========
// 添加音量控制计算属性
const volume = computed({
  get: () => GlobeTransmitItems.value[0].volume,
  set: (value) => {
    // 确保value在0-100之间
    const clampedValue = Math.max(0, Math.min(100, value));
    GlobeTransmitItems.value[0].volume = clampedValue;
    // 同步更新音频音量（确保在0-1之间）
    eventBus.$emit('set-volume', Math.min(1, Math.max(0, clampedValue / 100)));
  }
});

// 处理拖动
const handleDrag = (event) => {
  if (!isDragging.value) return;

  const container = document.getElementById('volume-slider-container');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const clientY = event.clientY;
  if (!clientY) return;

  let newVolume = 100 - ((clientY - rect.top) / rect.height * 100);
  // 确保newVolume在0-100之间
  newVolume = Math.max(0, Math.min(100, newVolume));
  volume.value = newVolume;
};

// 开始拖动音量滑块
const startDragging = (event) => {
  isDragging.value = true;
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDragging);
  handleDrag(event);
};

// 停止拖动
const stopDragging = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
};

// 处理音量调节按钮点击
const handleVolumeButtonClick = () => {
  showVolumeControl.value = !showVolumeControl.value;
  if (showVolumeControl.value) {
    selectedIndex.value = 17;
  } else {
    selectedIndex.value = -1;
  }
};

// ========== 已读界面处理 ==========
// 滚轮事件处理
const handleWheel = (event) => {
  if (!logList.value) return;
  event.preventDefault();

  const direction = event.deltaY > 0 ? 1 : -1;
  const itemHeight = 150;
  const { scrollTop, scrollHeight, clientHeight } = logList.value;
  const maxScroll = scrollHeight - clientHeight;

  if (direction > 0 && Math.abs(scrollTop - maxScroll) < 2) {
    eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + 'buttonreturn.ogg');
    showReadLog.value = false;
    isDialogVisible.value = true;
    return;
  }

  // 平滑滚动逻辑
  const currentIndex = Math.round(scrollTop / itemHeight);
  const targetIndex = currentIndex + direction;
  const maxIndex = Math.floor(maxScroll / itemHeight);
  const clampedTargetIndex = Math.max(0, Math.min(maxIndex, targetIndex));
  const targetScrollPosition = clampedTargetIndex * itemHeight;
  const targetScrollBarPosition = (targetScrollPosition / maxScroll) * 100;
  
  animateScroll(targetScrollBarPosition);
};

// 滚动条拖动
const startDraggingScroll = (event) => {
  event.preventDefault();
  isDraggingScroll.value = true;

  const container = document.getElementById('scroll-slider-container');
  if (!container) return;

  const rect = container.getBoundingClientRect();
  const clientY = event.clientY;
  if (!clientY) return;

  let newPosition = ((clientY - rect.top) / rect.height * 100);
  newPosition = Math.max(0, Math.min(100, newPosition));
  scrollPosition.value = newPosition;

  if (logList.value) {
    const { scrollHeight, clientHeight } = logList.value;
    const maxScroll = scrollHeight - clientHeight;
    logList.value.scrollTop = (newPosition / 100) * maxScroll;
  }

  const handleMouseMove = (moveEvent) => {
    if (!isDraggingScroll.value) return;

    const clientY = moveEvent.clientY;
    if (!clientY) return;

    let newPosition = ((clientY - rect.top) / rect.height * 100);
    newPosition = Math.max(0, Math.min(100, newPosition));

    requestAnimationFrame(() => {
      scrollPosition.value = newPosition;

      if (logList.value) {
        const { scrollHeight, clientHeight } = logList.value;
        const maxScroll = scrollHeight - clientHeight;
        logList.value.scrollTop = (newPosition / 100) * maxScroll;
      }
    });
  };

  const handleMouseUp = () => {
    isDraggingScroll.value = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // 平滑自动定位
    if (logList.value) {
      const { scrollTop } = logList.value;
      const itemHeight = 150;
      const targetIndex = Math.round(scrollTop / itemHeight);
      const snapPosition = targetIndex * itemHeight;

      const { scrollHeight, clientHeight } = logList.value;
      const maxScroll = scrollHeight - clientHeight;
      const targetScrollPosition = (snapPosition / maxScroll) * 100;

      animateScroll(targetScrollPosition);
    }
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// 滚动按钮处理
const handleScrollBtn = (dir) => {
  if (!logList.value) return;
  
  const itemHeight = 150;
  const { scrollTop, scrollHeight, clientHeight } = logList.value;
  const maxScroll = scrollHeight - clientHeight;
  const maxIndex = Math.floor(maxScroll / itemHeight);
  let targetIndex = Math.round(scrollTop / itemHeight);
  
  switch (dir) {
    case 'up':
      targetIndex = Math.max(0, targetIndex - 1);
      break;
    case 'down':
      targetIndex = Math.min(maxIndex, targetIndex + 1);
      break;
    case 'top':
      targetIndex = 0;
      break;
    case 'bottom':
      targetIndex = maxIndex;
      break;
  }
  
  const targetScrollPosition = targetIndex * itemHeight;
  const targetScrollBarPosition = (targetScrollPosition / maxScroll) * 100;
  
  animateScroll(targetScrollBarPosition);
};

// 滚动动画
const animateScroll = (targetPosition) => {
  const startPosition = scrollPosition.value;
  const distance = targetPosition - startPosition;
  const duration = 300;
  const startTime = performance.now();

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - (1 - progress) * (1 - progress);
    const currentPosition = startPosition + distance * easeProgress;
    
    scrollPosition.value = currentPosition;
    
    if (logList.value) {
      const { scrollHeight, clientHeight } = logList.value;
      const maxScroll = scrollHeight - clientHeight;
    logList.value.scrollTop = (currentPosition / 100) * maxScroll;
    }
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// ========== 对话切换处理 ==========
// 处理上一句
const handlePreviousDialog = () => {
  const prevPlotId = GlobeTransmitItems.value[0]?.currentPlotId - 1;
  const prevDialog = dataStore.DialogItems.find(item => item.plot_id === prevPlotId);
  if (prevDialog) {
    // 移除最后一条已读记录（如果有）
    if (GlobeTransmitItems.value[0].readLogList.length > 0) {
      GlobeTransmitItems.value[0].readLogList.pop();
    }
    handleDialogChange(prevPlotId);
  }
};

// 添加BGM控制函数
const handleBGM = (musicId) => {
  console.log('handleBGM called:', {
    currentBGM: currentBGM.value,
    newMusicId: musicId,
    isDifferent: currentBGM.value !== musicId
  });

  // 如果musicId和当前播放的BGM相同，不做任何操作
  if (currentBGM.value === musicId) {
    console.log('Same BGM, skipping...');
    return;
  }
  
  console.log('Changing BGM from', currentBGM.value, 'to', musicId);
  
  // 更新当前BGM
  currentBGM.value = musicId;
  
  // 播放新的BGM
  if (musicId) {
    console.log('Playing new BGM:', ASSET_PATHS.BGM + 'BGM' + musicId + '.wav');
    eventBus.$emit('set-bgm', ASSET_PATHS.BGM + 'BGM' + musicId + '.wav');
  }
};

// 修改handleDialogChange函数
const handleDialogChange = (newPlotId) => {
  const dialog = DialogItems.value.find(item => item.plot_id === newPlotId);
  const currentDialog = DialogItems.value.find(item => item.plot_id === GlobeTransmitItems.value[0]?.currentPlotId);

  console.log('Dialog change:', {
    from: GlobeTransmitItems.value[0]?.currentPlotId,
    to: newPlotId,
    currentMusic: currentDialog?.music,
    newMusic: dialog?.music
  });

  if (dialog && GlobeTransmitItems.value[0]) {
    // 检查背景是否变化
    const isBackgroundChanged = currentDialog && currentDialog.background !== dialog.background;

    if (isBackgroundChanged) {
      // 如果背景变化，使用遮罩
      const mask = document.getElementById('transition-mask');
      if (mask) {
        // 显示遮罩
        mask.style.opacity = '1';

        setTimeout(() => {
          // 更新内容
          GlobeTransmitItems.value[0].currentPlotId = newPlotId;
          GlobeTransmitItems.value[0].currentBackground = dialog.background;
          GlobeTransmitItems.value[0].currentChapter = dialog.chapter;

          // ========== 剧情切换音效 ==========
          if (dialog.sound) {
            eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + dialog.sound);
          }

          // 处理BGM切换 - 确保在状态更新后调用
          nextTick(() => {
            handleBGM(dialog.music);
          });

          if (dialog.voice) {
            eventBus.$emit('set-voice', ASSET_PATHS.SOUND + dialog.voice + '.ogg');
          }

          // 启动打字机效果
          if (dialog.text) {
            startTyping(dialog.text);
          }

          // 隐藏遮罩
          setTimeout(() => {
            mask.style.opacity = '0';
          }, 50);
        }, 300);
      }
    } else {
      // 如果背景没变化，直接更新内容
      GlobeTransmitItems.value[0].currentPlotId = newPlotId;
      GlobeTransmitItems.value[0].currentBackground = dialog.background;
      GlobeTransmitItems.value[0].currentChapter = dialog.chapter;

      // ========== 剧情切换音效 ==========
      // 处理BGM切换 - 确保在状态更新后调用
      nextTick(() => {
        handleBGM(dialog.music);
      });

      if (dialog.voice) {
        eventBus.$emit('set-voice', ASSET_PATHS.SOUND + dialog.voice + '.ogg');
      }
      
      // 启动打字机效果
      if (dialog.text) {
        startTyping(dialog.text);
      }
    }
  }
};

// 选项点击处理
const optionClick = (index) => {
  if (!currentJump.value) return null; 
  if (index === 0) {
    handleDialogChange(currentJump.value.plot_id1);
        }
  if (index === 1) {
    handleDialogChange(currentJump.value.plot_id2);
  }
};

// ========== 工具函数 ==========
// 获取当前应该显示的图片源
const img = (index) => {
  if (index === 0 && isButtonBarFixed.value) {
    return activeImages[index];
  } else if (index === selectedIndex.value) {
    return activeImages[index];
  } else if (index === hoveredIndex.value) {
    return hoverImages[index];
  } else {
    return baseImages[index];
  }
};

// 获取功能说明文字
const getFunctionTipText = () => {
  if (hoveredIndex.value === -1) return '';
  return FUNCTION_TIP_TEXTS[hoveredIndex.value];
};

// ========== 打字机效果 ==========
// 开始打字机效果
const startTyping = (text) => {
  // 清除之前的定时器
  if (typingTimer.value) {
    clearTimeout(typingTimer.value);
  }
  
  // 重置状态
  displayedLines.value = [];
  isTyping.value = true;
  
  // 将文本按行分割
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length === 0) {
    isTyping.value = false;
    return;
  }
  
  // 开始逐行打字
  typeLine(lines, 0, 0);
};

// 逐行打字
const typeLine = (lines, lineIndex, charIndex) => {
  if (lineIndex >= lines.length) {
    // 所有行都打完了
    isTyping.value = false;
    return;
  }
  
  const currentLine = lines[lineIndex];
  
  if (charIndex === 0) {
    // 开始新的一行
    displayedLines.value[lineIndex] = [];
  }
  
  if (charIndex < currentLine.length) {
    // 添加下一个字符
    displayedLines.value[lineIndex][charIndex] = currentLine[charIndex];
    
    // 继续打下一个字符
    typingTimer.value = setTimeout(() => {
      typeLine(lines, lineIndex, charIndex + 1);
    }, typingSpeed.value);
  } else {
    // 当前行打完了，开始下一行
    typingTimer.value = setTimeout(() => {
      typeLine(lines, lineIndex + 1, 0);
    }, 200); // 行间延迟
  }
};

// 跳过打字机效果，直接显示完整文本
const skipTyping = () => {
  if (typingTimer.value) {
    clearTimeout(typingTimer.value);
  }
  
  const text = currentDialog.value.text;
  const lines = text.split('\n').filter(line => line.trim() !== '');
  
  displayedLines.value = lines.map(line => line.split(''));
  isTyping.value = false;
};

// 检查是否正在打字
const isCurrentlyTyping = () => {
  return isTyping.value;
};

// ========== 计算属性 ==========
// 立绘动画key
const leftCharacterKey = computed(() => `${leftCharacter.value || ''}_${leftPoseType.value}_${leftPose.value}_${leftFace.value}`);
const middleCharacterKey = computed(() => `${middleCharacter.value || ''}_${middlePoseType.value}_${middlePose.value}_${middleFace.value}`);
const rightCharacterKey = computed(() => `${rightCharacter.value || ''}_${rightPoseType.value}_${rightPose.value}_${rightFace.value}`);

// 在<script setup>中添加事件处理函数
const handleBackBtnHover = () => {
  eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + 'buttonhover.ogg');
};
const handleBackBtnClick = () => {
  eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + 'buttonreturn.ogg');
  showReadLog.value = false;
  isDialogVisible.value = true;
};

const handleScrollBtnHover = () => {
  eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + 'buttonhover.ogg');
};
const handleScrollBtnClick = (dir) => {
  eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + '切替1.ogg');
  handleScrollBtn(dir);
};

const handleOptionHover = () => {
  eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + 'buttonhover.ogg');
};
const handleOptionClick = (idx) => {
  eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + '决定1.ogg');
  optionClick(idx);
};

const handleReadLogItemHover = () => {
  eventBus.$emit('set-sound2', ASSET_PATHS.SOUND + 'buttonhover.ogg');
};

const router = useRouter();

// 添加计算属性
const isButtonBarFixed = computed({
  get: () => GlobeTransmitItems.value[0].isButtonBarFixed,
  set: (value) => {
    GlobeTransmitItems.value[0].isButtonBarFixed = value;
  }
});
</script>

<style src="../assets/css/dialog.css"></style>
<style src="../assets/css/character.css"></style>
