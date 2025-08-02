<template>
    <div id="save-main">
        <img src="../assets/static/Loaddata/70114.png" id="bg-savedata-image1">
        <img src="../assets/static/Loaddata/70112.png" id="bg-savedata-image2">
        <div id="main-app">
            <div id="content-overlay">
                <input type="range" class="custom-slider" id="customSlider" min="0" max="29" v-model.number="PageValue"
                    @mouseover="handleMouseOver(18)">
                <img src="../assets/static/savedata/29983.png" id="savedata-count" @mouseover="handleMouseOver(19)">
                <div id="PageValueShow">{{ formattedNumber }}</div>
                <div id="savedata-setting1">
                    <img :src="img(0)" class="setting-buttons1" @mouseover="handleMouseOver(0)"
                        @mouseout="handleMouseOut(0)" @mousedown="handleMouseDown(0)" @mouseup="handleMouseUp(0)"
                        @click="handleClick(0)">
                    <img :src="img(1)" class="setting-buttons1" @mouseover="handleMouseOver(1)"
                        @mouseout="handleMouseOut(1)" @mousedown="handleMouseDown(1)" @mouseup="handleMouseUp(1)"
                        @click="handleClick(1)">
                    <img :src="img(2)" class="setting-buttons1" @mouseover="handleMouseOver(2)"
                        @mouseout="handleMouseOut(2)" @mousedown="handleMouseDown(2)" @mouseup="handleMouseUp(2)"
                        @click="handleClick(2)">
                    <img :src="img(3)" class="setting-buttons1" style="margin-left: 15%;"
                        @mouseover="handleMouseOver(3)" @mouseout="handleMouseOut(3)" @mousedown="handleMouseDown(3)"
                        @mouseup="handleMouseUp(3)" @click="handleClick(3)">
                    <img :src="img(4)" class="setting-buttons1" @mouseover="handleMouseOver(4)"
                        @mouseout="handleMouseOut(4)" @mousedown="handleMouseDown(4)" @mouseup="handleMouseUp(4)"
                        @click="handleClick(4)">
                    <img :src="img(5)" class="setting-buttons1" @mouseover="handleMouseOver(5)"
                        @mouseout="handleMouseOut(5)" @mousedown="handleMouseDown(5)" @mouseup="handleMouseUp(5)"
                        @click="handleClick(5)">
                    <img :src="img(6)" class="setting-buttons1" style=" margin-left:2%;" @mouseover="handleMouseOver(6)"
                        @mouseout="handleMouseOut(6)" @mousedown="handleMouseDown(6)" @mouseup="handleMouseUp(6)"
                        @click="handleClick(6)">
                    <img :src="img(7)" class="setting-buttons1" style=" margin-left:6%;" @mouseover="handleMouseOver(7)"
                        @mouseout="handleMouseOut(7)" @mousedown="handleMouseDown(7)" @mouseup="handleMouseUp(7)"
                        @click="handleClick(7)">
                </div>
                <div id="savedata-setting2">
                    <img :src="img(8)" class="setting-buttons2" @mouseover="handleMouseOver(8)"
                        @mouseout="handleMouseOut(8)" @click="handleClick2(8)">
                    <img :src="img(9)" class="setting-buttons2" @mouseover="handleMouseOver(9)"
                        @mouseout="handleMouseOut(9)" @click="handleClick2(9)">
                    <img :src="img(10)" class="setting-buttons2" @mouseover="handleMouseOver(10)"
                        @mouseout="handleMouseOut(10)" @click="handleClick2(10)">
                    <img :src="img(11)" class="setting-buttons2" @mouseover="handleMouseOver(11)"
                        @mouseout="handleMouseOut(11)" @click="handleClick2(11)">
                </div>
                <div id="savedata-setting4">
                    <img src="../assets/static/Loaddata/28191.png">
                    <img src="../assets/static/Loaddata/28161.png" style="margin-left: 10%;">
                </div>
                <div class="data-container" @wheel="handleWheel">
                    <div id="data-grid" :style="{ transform: `translateY(-${PageValue * 23}vh)` }">
                        <div v-for="(item, index) in items" :key="item.id" class="data-block"
                            :style="{ cursor: (item.dataShow || (isAllCanBeSelected && !twoClick )) ? 'pointer' : 'default' }">
                            <img :src="item.isHover && (item.dataShow || (isAllCanBeSelected && !twoClick )) ? item.hoverImage : item.defaultImage"
                                class="savedata-block" @mouseover="dataMouseHover(index)"
                                @mouseout="dataMouseOut(index)" @click="dataClick(index)"
                                :style="{ 'pointer-events': (item.dataShow || (isAllCanBeSelected && !twoClick )) ? 'auto' : 'none' }">
                            <img :src="'src/assets/static/bgimage/' + item.background" class="data-backgroundImage"
                                v-show="item.dataShow">
                            <div class="data-showID"
                                :style="{ color: item.isHover && (item.dataShow || (isAllCanBeSelected && !twoClick )) ? '#FEFEFE' : '#AA8A68' }">
                                {{ item.showID
                                }}</div>
                            <div class="data-commentsave" v-show="item.dataShow">
                                <img src="../assets/static/savedata/70703.png" style=" transform: scale(0.8)">
                                <div class="data-comment">「{{ item.comment }}」</div>
                            </div>
                            <div class="data-time" v-show="item.dataShow">
                                <img src="../assets/static/savedata/70684.png" style=" transform: scale(0.9)">
                                <div class="data-timestamp">{{ $formatDate(item.timestamp, 'YYYY/MM/DD HH:mm') }}</div>
                                <div class="data-chapter">{{ item.chapter }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <transition name="text-fade-in-out">
                    <div class="detail" v-if="detailitem.detailShow">
                        <img :src="'src/assets/static/bgimage/' + detailitem.detailImg" class="detail-background">
                        <div class="detail-date">{{ $formatDate(detailitem.detailTime, 'YYYY/MM/DD HH:mm') }}</div>
                        <div class="detail-chapter">{{ detailitem.detailChapter }}</div>
                        <div class="detail-comment">「{{ detailitem.detailComment }}」</div>
                    </div>
                </transition>
                <div id="savedata-setting3">
                    <img :src="img(12)" class="setting-buttons3" @mouseover="handleMouseOver(12)"
                        @mouseout="handleMouseOut(12)" @mousedown="handleMouseDown(12)" @mouseup="handleMouseUp(12)"
                        @click="goToSave">
                    <img :src="img(13)" class="setting-buttons3" @mouseover="handleMouseOver(13)"
                        @click="CommentOverlay" @mouseout="handleMouseOut(13)" @mousedown="handleMouseDown(13)"
                        @mouseup="handleMouseUp(13)">
                    <img :src="img(14)" class="setting-buttons3" @mouseover="handleMouseOver(14)"
                        @mouseout="handleMouseOut(14)" @mousedown="handleMouseDown(14)" @mouseup="handleMouseUp(14)">
                    <img :src="img(15 + GlobeTransmitItems[0].isInDialog)" class="setting-buttons3"
                        @mouseover="handleMouseOver(15 + GlobeTransmitItems[0].isInDialog)"
                        @mouseout="handleMouseOut(15 + GlobeTransmitItems[0].isInDialog)"
                        @mousedown="handleMouseDown(15 + GlobeTransmitItems[0].isInDialog)"
                        @mouseup="handleMouseUp(15 + GlobeTransmitItems[0].isInDialog)" @click="goToPage"
                        style="position: fixed; margin-left: 1.5%; ">
                </div>
                <div id="setting-text">
                    <transition name="text-fade-in-out">
                        <p v-text="saveMessage" :key="messageKey" v-if="currentKey === messageKey"
                            class="setting-text-p"></p>
                    </transition>
                </div>
            </div>
            <div>
                <transition name="overlay-fade-in-out">
                    <div v-show="showOverlay" id="overlay1">
                        <div id="ensurelog">
                            <img src="../assets/static/savedata/70777.png">
                            <p id="ensureText">确定要执行此操作么？</p>
                            <button id="ensureButton1" @mouseover="handleMouseOver(17)"
                                @click="ensureClick(0)"><span>是</span></button>
                            <button id="ensureButton2" @mouseover="handleMouseOver(18)"
                                @click="ensureClick(1)"><span>否</span></button>
                        </div>
                    </div>
                </transition>
            </div>
            <div>
                <transition name="overlay-fade-in-out">
                    <div v-show="showComment" id="overlay2">
                        <div id="CommentOverlog">
                            <img src="../assets/static/savedata/70777.png">
                            <p id="ensureText" style="top: 20%;">请输入评论</p>
                            <textarea id="comment-text-area" v-model="currentComment"></textarea>
                            <button style="top: 60%;" id="ensureButton1" @mouseover="handleMouseOver(17)"
                                @click="ensureClick(0)"><span>是</span></button>
                            <button style="top: 60%;" id="ensureButton2" @mouseover="handleMouseOver(18)"
                                @click="ensureClick(1)"><span>否</span></button>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import eventBus from '../components/event-bus.js';
import { useDataStore, postData } from '../components/dataStore.js';


const dataStore = useDataStore();
const link2 = 'src/assets/static/loaddata/';
const sound = 'src/assets/static/sound/'
//路由设置
const router = useRouter();
const { GlobeTransmitItems } = storeToRefs(dataStore);
const goToPage = () => {
    eventBus.$emit('set-sound2', sound + 'buttonreturn.ogg');
    if (GlobeTransmitItems.value[0].isInDialog === 0) {
        router.push({
            name: 'Index',
        });
    } else {
        router.push({
            name: 'Dialog',
        });
    }
};
const goToSave = () => {
    eventBus.$emit('set-voice', sound + 'save.ogg');
    router.push({
        name: 'Savedata',
    });
};
const goToDialog = () => {
    //eventBus.$emit('set-voice', sound + 'save.ogg');
    router.push({
        name: 'Dialog',
    });
};



//下面主要内容  
// 基础图片路径数组
const baseImages = Array.from({ length: 17 }, (_, i) =>
    link2 + `baseImages/${i}.png`
);

// 悬停图片路径数组
const hoverImages = Array.from({ length: 17 }, (_, i) =>
    link2 + `hoverImages/${i}.png`
);

// 点击图片路径数组
const activeImages = Array.from({ length: 17 }, (_, i) =>
    link2 + `activeImages/${i}.png`
);

const MessageText = [
    "后退至第一页。",
    "后退6行。",
    "后退1行。",
    "前进1行。",
    "前进6行。",
    "前进至第一页。",
    "后退1页。",
    "前进1页。",
    "切换为复制数据模式。",
    "切换为移动数据模式。",
    "切换为编辑数据评论模式。",
    "切换为删除数据模式。",
    "移动至读档界面。",
    "移动至快速读档界面。(素材不够，摆了喵)",
    "移动至声音收藏界面。(素材不够，摆了喵)",
    "回到标题界面。",
    "",
    "",
    "选择页。",
];

//遮罩初始化
const showOverlay = ref(false)
const ClickOverlay = async () => {
    showOverlay.value = !showOverlay.value;
};
const showComment = ref(false);
const CommentOverlay = async () => {
    showComment.value = !showComment.value;
};
const currentComment = ref('');


//PageValue初始化
const PageValue = ref(0);
const formattedNumber = computed(() => {
    return (PageValue.value + 1).toString().padStart(4, '0');
});

//savedata-Text初始化
const saveMessage = ref('读档界面，请选择想要读取的进度。')
const currentKey = ref(0);
const messageKey = ref(0);

//主要按钮索引和情况辨别初始化
const hoveredIndex = ref(-1);
const selectedIndex = ref(-1);


// Data结构
const hoverStates = ref({}); //标记悬浮
const clickStates = ref({}); //标记锁定
const { SaveItems } = storeToRefs(dataStore);
const items = computed(() => {
    return SaveItems.value.map((itemData, index) => ({
        id: index,
        showID: '000-' + (index + 1).toString().padStart(3, '0'),
        dataShow: itemData.plot_id >= 0,
        background: itemData.background,
        comment: itemData.comment,
        timestamp: itemData.timestamp,
        chapter: itemData.chapter,
        defaultImage: 'src/assets/static/savedata/70725.png',
        hoverImage: 'src/assets/static/savedata/70702.png',
        isHover: hoverStates.value[index] || clickStates.value[index] || false  //三元表达式，点击或选定态
    }))
})

//detail结构
const dataIndex = ref(-1);
const detailitem = computed(() => {
    if (dataIndex.value === -1) {
        return {
            detailShow: false,
            detailImg: "",
            detailTime: "",
            detailChapter: "",
            detailComment: "",
        };
    } else {
        return {
            detailShow: true,
            detailImg: SaveItems.value[dataIndex.value].background,
            detailTime: SaveItems.value[dataIndex.value].timestamp,
            detailChapter: SaveItems.value[dataIndex.value].chapter,
            detailComment: SaveItems.value[dataIndex.value].comment,
        }
    }
})

const isAllCanBeSelected = ref(false);
const currentdata1 = ref(-1);  //最新的
const currentdata2 = ref(-1);  //如果要两个，这个是前面的
let twoClick = ref(false);
const dataClick = (index) => {
    if (twoClick.value === false) {
        clickStates.value = {
            ...clickStates.value,
            [index]: true
        };
        currentdata1.value = {
            index: index,
            Did: SaveItems.value[index].Did,
            plot_id: SaveItems.value[index].plot_id,
            background: SaveItems.value[index].background,
            storyArc: SaveItems.value[index].storyArc,
            chapter: SaveItems.value[index].chapter,
            comment: SaveItems.value[index].comment,
        };
        if (mode === 0 || mode === 1 || mode === 2 || mode === 4) {
            ClickOverlay();
        }
        if (mode === 3) {
            CommentOverlay();
            currentComment.value = currentdata1.value.comment;
        }
    }
    if (twoClick.value === true) {
        clickStates.value = {
            ...clickStates.value,
            [index]: true
        };
        if (mode === 1 || mode === 2) {
            currentdata2.value = {
                index: index,
                Did: SaveItems.value[index].Did,
                plot_id: SaveItems.value[index].plot_id,
                background: SaveItems.value[index].background,
                storyArc: SaveItems.value[index].storyArc,
                chapter: SaveItems.value[index].chapter,
                comment: SaveItems.value[index].comment,
            };
            twoClick.value = false;
            isAllCanBeSelected.value = true;
        }
    }
}


const dataMouseHover = (index) => {
    hoverStates.value = {
        ...hoverStates.value,
        [index]: true
    };
    if (SaveItems.value[index].plot_id >= 0) {
        console.log("dataIndex改变");
        dataIndex.value = index;
    }
    let modename = "读取";
    if (mode === 0) {
        modename = "读取"
    }
    else if (mode === 1) {
        if (twoClick.value === true && SaveItems.value[index].plot_id >= 0) { modename = "复制" }
        else if (twoClick.value === false) { modename = "将上个数据复制给" };
    }
    else if (mode === 2) {
        if (twoClick.value === true && SaveItems.value[index].plot_id >= 0) { modename = "移动" }
        else if (twoClick.value === false) { modename = "将上个数据移动到" };
    }
    else if (mode === 3 && SaveItems.value[index].plot_id >= 0) {
        modename = "编辑";
    }
    else if (mode === 4 && SaveItems.value[index].plot_id >= 0) {
        modename = "删除";
    }
    updateMessage(modename + '000-' + (index + 1).toString().padStart(3, '0') + "号存档。 ")
};

const dataMouseOut = (index) => {
    hoverStates.value = {
        ...hoverStates.value,
        [index]: false
    };
    if (SaveItems.value[index].plot_id >= 0) {
        dataIndex.value = -1;
        updateMessage("")
    }
}

let mode = 0;//模式，0为读取，1为复制，2为替换，3为编辑，4为删除
const ensureClick = async (index) => {          //此处应该同时根据mode、选择的blockChoicedID1,blockChoicedID2进行判断。
    if (index === 0) {
        eventBus.$emit('set-sound2', sound + 'buttonclick-save.ogg');
        const keys = Object.keys(clickStates.value);
        keys.forEach(key => {
            clickStates.value[key] = false;
        });//重新置为false
        showOverlay.value = false;
        showComment.value = false;
        if (mode === 0) {
            console.log("执行读取操作");
            GlobeTransmitItems.value[0].readLogList=[];
            GlobeTransmitItems.value[0].currentPlotId=currentdata1.value.plot_id
            GlobeTransmitItems.value[0].storyArc=currentdata1.value.storyArc;
            goToDialog();
        };
        if (mode === 1) {
            console.log("执行复制操作");
            SaveItems.value[currentdata1.value.index].plot_id = currentdata2.value.plot_id;
            SaveItems.value[currentdata1.value.index].background = currentdata2.value.background;
            SaveItems.value[currentdata1.value.index].chapter = currentdata2.value.chapter;
            SaveItems.value[currentdata1.value.index].storyArc = currentdata2.value.storyArc;
            SaveItems.value[currentdata1.value.index].comment = currentdata2.value.comment;
            SaveItems.value[currentdata1.value.index].timestamp = Date.now();
            try  {
                const data = { Did1: currentdata2.value.Did, Did2: currentdata1.value.Did };   //Did1传给Did2
                const response =  await  postData(1, data);
                console.log('API响应:', response);
            } catch (error) {
                console.error('请求失败:', error.message);
            }
        };
        if (mode === 2) {
            console.log("执行移动操作");
            SaveItems.value[currentdata1.value.index].plot_id = currentdata2.value.plot_id;
            SaveItems.value[currentdata1.value.index].background = currentdata2.value.background;
            SaveItems.value[currentdata1.value.index].chapter = currentdata2.value.chapter;
            SaveItems.value[currentdata1.value.index].storyArc = currentdata2.value.storyArc;
            SaveItems.value[currentdata1.value.index].comment = currentdata2.value.comment;
            SaveItems.value[currentdata1.value.index].timestamp = Date.now();
            SaveItems.value[currentdata2.value.index].plot_id = -1;
            try {
                const data = { Did1: currentdata2.value.Did, Did2: currentdata1.value.Did,timestamp: Date.now() };  //Did1传给Did2,清除1
                const response =  await  postData(2, data);
                console.log('API响应:', response);
            } catch (error) {
                console.error('请求失败:', error.message);
            }
        };
        if (mode === 3) {
            console.log("执行编辑操作");
            currentdata1.value.comment = currentComment.value;
            SaveItems.value[currentdata1.value.index].comment = currentComment.value;
            try {
                const data = { Did: currentdata1.value.Did, comment: currentdata1.value.comment,timestamp: Date.now() };
                const response =  await  postData(3, data);
                console.log('API响应:', response);
            } catch (error) {
                console.error('请求失败:', error.message);
            }
        };
        if (mode === 4) {
            console.log("执行删除操作");
            SaveItems.value[currentdata1.value.index].plot_id = -1;
            try {
                const data = { Did: currentdata1.value.Did };
                const response =  await  postData(4, data);
                console.log('API响应:', response);
            } catch (error) {
                console.error('请求失败:', error.message);
            }
        }
    } else if (index === 1) {
        const keys = Object.keys(clickStates.value);
        keys.forEach(key => {
            clickStates.value[key] = false;
        });//重新置为false
        eventBus.$emit('set-sound2', sound + 'buttonreturn.ogg');
        showOverlay.value = false;
        showComment.value = false;
    }
    if (mode === 0 || mode === 4 || mode === 3) {
        twoClick.value = false;
    }
    if (mode === 1 || mode === 2) {
        twoClick.value = true;
    }
    isAllCanBeSelected.value = false;

}

// 滑轮控制（保持不变）
const maxPage = computed(() => {
    return Math.max(0, Math.ceil(items.value.length / 4) - 3)
})

const handleWheel = (event) => {
    event.preventDefault()
    if (event.deltaY < 0) {
        PageValue.value = Math.max(0, PageValue.value - 1);
        console.log("PageValue:" + PageValue.value);
    } else {
        PageValue.value = Math.min(maxPage.value, PageValue.value + 1);
        console.log("PageValue:" + PageValue.value);
    }
}



// 处理鼠标悬停事件
const handleMouseOver = (index) => {
    eventBus.$emit('set-sound1', sound + 'buttonhover.ogg');
    if (index !== selectedIndex.value) {
        hoveredIndex.value = index;
    }
    if (index != 17 && index != 18) {
        updateMessage(MessageText[index])
    }
};


// 处理鼠标离开事件
const handleMouseOut = (index) => {
    // 如果不是选中状态，才移除悬停效果
    if (index !== selectedIndex.value) {
        hoveredIndex.value = -1;
    }
    updateMessage("")
};

const handleMouseDown = (index) => {
    selectedIndex.value = index;
};

// 鼠标抬起事件
const handleMouseUp = (index) => {
    selectedIndex.value = -1;
};
//多个不同分类鼠标点击事件
const handleClick = (index) => {
    eventBus.$emit('set-sound2', sound + 'buttonclick-save.ogg');

    switch (index) {
        case 0:
            const decreaseToZero = () => {
                if (PageValue.value <= 0) return;
                PageValue.value -= 1;
                requestAnimationFrame(decreaseToZero);
            };
            decreaseToZero();
            break;

        case 1:
            PageValue.value -= 6;
            break;

        case 2:
            PageValue.value -= 1;
            break;

        case 3:
            PageValue.value += 1;
            break;

        case 4:
            PageValue.value += 6;
            break;

        case 5:
            const increaseToMax = () => {
                if (PageValue.value >= 29) return;
                PageValue.value += 1; // 修改这里
                requestAnimationFrame(increaseToMax);
            };
            increaseToMax();
            break;
        case 6:
            PageValue.value -= 3;
            break;
        case 7:
            PageValue.value += 3;
            break;
    }
    if (PageValue.value < 0) {
        PageValue.value = 0;
    }
    if (PageValue.value > 29) {
        PageValue.value = 29;
    }
};



const handleClick2 = (index) => {   //setting2一行
    eventBus.$emit('set-sound2', sound + 'buttonclick-save.ogg');
    if (selectedIndex.value === index) {
        selectedIndex.value = -1;
    } else {
        selectedIndex.value = index;
    }
    if (index === 8) {
        if (mode === 1) { mode = 0; twoClick.value = false; console.log("模式" + mode) }
        else { mode = 1; twoClick.value = true; console.log("模式" + mode) }
    }
    if (index === 9) {
        if (mode === 2) { mode = 0; twoClick.value = false; console.log("模式" + mode) }
        else { mode = 2; twoClick.value = true; console.log("模式" + mode) }
    }
    if (index === 10) {
        if (mode === 3) { mode = 0; twoClick.value = false; console.log("模式" + mode) }
        else { mode = 3; twoClick.value = false; console.log("模式" + mode) }
    }
    if (index === 11) {
        if (mode === 4) { mode = 0; twoClick.value = false; console.log("模式" + mode) }
        else { mode = 4; twoClick.value = false; console.log("模式" + mode) }
    }
    const keys = Object.keys(clickStates.value);
        keys.forEach(key => {
            clickStates.value[key] = false;
        });//重新置为false
};

// 获取当前应该显示的图片源
const img = (index) => {
    if (index === selectedIndex.value) {
        return activeImages[index]; // 选中状态
    } else if (index === hoveredIndex.value) {
        return hoverImages[index]; // 悬停状态
    } else {
        return baseImages[index]; // 正常状态
    }
};
const updateMessage = (text) => {
    currentKey.value = -1;
    nextTick(() => {
        messageKey.value++;
        currentKey.value = messageKey.value;
        saveMessage.value = text;
    });
};

</script>

<style scoped>
@import '../assets/css/savedata.css';
</style>