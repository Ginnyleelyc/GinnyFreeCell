// initialize
var allCards = [];
var category = ["s", "d", "c", "h"];
var cardsGroup = [[], [], [], [], [], [], [], []];

// 整理52張卡牌（賦予ID,IMG,COLOR)
for (var i = 0; i < category.length; i++) {
    for (var j = 1; j <= 13; j++) {
        var id = category[i] + j;
        var bg = "background-image: url(../img/cards/" + id + ".png)";
        var card = {
            id: id,
            bg: bg,
            number:j,
            color: ((category[i] == "s" || category[i] == "c") ? 'black' : 'red'),
            category: category[i],
        }
        allCards.push(card)
    }
}

// 隨機分組
function split(arr, group) {

    var size = group.length; // 分多少组
    var length = arr.length; // 人数总长度

    // 每次随机叫一个人，跳进一个组里，并从原数组里踢掉
    while (arr.length) {
        for (let i = 0; i < length; i++) {
            let index = Math.random() * arr.length | 0;  // 随机
            group[i % size].push(arr[index]);            // 入组
            arr.splice(index, 1);                        // 踢掉
        }
    }
    group.sort(() => Math.random() * 2 - 1); //重新隨機排序group
};
// 組cards字串
function MakeCardStr(cardsGroup) {

    var CardStr = "";
    cardsGroup.forEach(function (item) {
        CardStr += '<div class="cards-group" data-role="drag-drop-container" data-container="cards-group">';

        item.forEach(function (item) {
            CardStr += '<div class="cards" id="' + item.id + '" style="' + item.bg + '" data-category="' + item.category + '" data-num="' + item.number +'" draggable="true"></div>';
        })
        CardStr += '</div>';
    });
    $('.bottom-grid').html(CardStr);

    // // Allow multiple draggable items
    // let dragSources = document.querySelectorAll('[draggable="true"]')
    // dragSources.forEach(dragSource => {
    //     dragSource.addEventListener('dragstart', dragStart);
    //     dragSource.addEventListener('dragend', dragEnd);
    //     dragSource.addEventListener('drop', cancelDefault);
    // })

    // // Allow multiple dropped targets
    // let dropTargets = document.querySelectorAll('[data-role="drag-drop-container"]')
    // dropTargets.forEach(dropTarget => {
    //     dropTarget.addEventListener('drop', dropped, true);
    //     dropTarget.addEventListener('dragenter', cancelDefault);
    //     dropTarget.addEventListener('dragover', cancelDefault);
    //     // console.log("DT:", dropTarget);
    // })
};



// Time
var startTime, endTime;
var countTime = {};
var time = 0;
var minutes = 0;
var seconds = 0;
var moves = 0;
function getTime() {
    time++;
    minutes = Math.floor(time / 60) % 60 || 0;
    seconds = time % 60 || 0;
    $('#time-num').text(timestr(minutes, seconds))
    if (time == 3600) {
        console.log("TU");
        $('#time-num').text(`Time's up`);
        window.clearInterval(countTime);
        countTime = {};
        time = 0;
        minutes = 0;
        seconds = 0;
    }
    
}
function timestr(minutes, seconds) {
    var min = (minutes).toString().length === 1 ? '0' + minutes : minutes;
    var sec = (seconds).toString().length === 1 ? '0' + seconds : seconds;
    var timeStr = min + " : " + sec;
    return timeStr;
}
function startTime() {
    countTime = window.setInterval(function () { getTime() }, 1000);
}
function pauseTime() {
    window.clearInterval(countTime);
    countTime = {};
}
function refreshTime() {
    window.clearInterval(countTime);
    countTime = {};
    time = 0;
    minutes = 0;
    seconds = 0;
    moves = 0;
    $('#time-num').text(timestr(minutes, seconds))
    startTime();
    $('#moves-num').text(moves)
}



function dragStart(e) {
    this.classList.add('dragging');
    e.dataTransfer.setData('id', e.target.id);
    e.dataTransfer.setData('category', e.target.dataset.category);
    e.dataTransfer.setData('num', e.target.dataset.num);
    console.log(e.target)
}
function dragEnd(e) {
    this.classList.remove('dragging');
}

function dropped(e) {
    
    cancelDefault(e);
    let id = e.dataTransfer.getData('id');
    let category = e.dataTransfer.getData('category');
    let num = e.dataTransfer.getData('num');

    // switch (e.target.dataset.container){
    //     case 'cards': 
    //         if (e.target.parentElement.className == 'cards-container card-border mr-3') break;
    //         e.target.parentElement.append(document.querySelector('#' + id));
    //         break;
    //     case 'cards-group':
    //         e.target.append(document.querySelector('#' + id));
    //         break;
    //     case 'cards-container card-border mr-3':
    //         e.target.append(document.querySelector('#' + id));
    //         break;
    //     case 'mr-3 card-spade card-border':
    //         e.target.append(document.querySelector('#' + id));
    //         break;
    // }
    if (e.target.className == 'cards'){
        if (e.target.parentElement.dataset.container == 'temporary') return;
        if (e.target.parentElement.dataset.container == 'card-spade'){
            e.target.append(document.querySelector('#' + id));
            moves++;
        }else{
            e.target.parentElement.append(document.querySelector('#' + id));
            moves++;
        }
        
    } else if (e.target.dataset.container == 'cards-group'){
        e.target.append(document.querySelector('#' + id));
        moves++;
    } else if (e.target.dataset.container == 'temporary') {
        e.target.append(document.querySelector('#' + id));
        moves++;
    } else if (e.target.dataset.container == 'temporary') {
        e.target.append(document.querySelector('#' + id));
        moves++;
    } else if (e.target.dataset.container == 'card-spade') {
        var nowNum = 1;
        if (category == 's' && nowNum == num){
            e.target.append(document.querySelector('#' + id));
            nowNum ++;
            moves++;
        }
        //console.log(e.target.dataset.container,nowNum)
        
    }
    $('#moves-num').text(moves)
}

function cancelDefault(e) {
    e.preventDefault()
    e.stopPropagation()
    return false
}





split(allCards, cardsGroup);
MakeCardStr(cardsGroup);
startTime();
$(".newGame").on("click", function () {
    $('#confirmModal,#pauseModal').modal('hide');
    $('.temporary > div, .correct > div').empty();
    split(allCards, cardsGroup);
    MakeCardStr(cardsGroup);
    refreshTime();
});
$(".restart").on("click", function () {
    $('.temporary > div, .correct > div').empty();
    MakeCardStr(cardsGroup);
    $('#pauseModal').modal('hide');
    refreshTime();
});
$(".keepPlay").on("click", function () {
    $('#pauseModal').modal('hide');
    startTime();
});
$(".pause").on("click", function () {
    pauseTime();
});







// // 洗牌function
// function shuffle(array) {
//     var currentIndex = array.length, temporaryValue, randomIndex;

//     // While there remain elements to shuffle...
//     while (currentIndex != 0) {

//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);

//         // And swap it with the current element.
//         temporaryValue = array[currentIndex - 1];
//         array[currentIndex - 1] = array[randomIndex];
//         array[randomIndex] = temporaryValue;

//         currentIndex -= 1;
//     }

//     return array;
// };

// // 將牌組洗牌
// allCards = shuffle(allCards);

// // 開始發牌，共發52(allCards.length)張牌
// for (var n = 0, k = 0; n < allCards.length; n++) {
//     // 發牌到第k行
//     cardsGroup[k].push(allCards[n]);
//     // 前半段，每行七張牌，每Push七張就換行，且防止第一行就換行
//     if ((k < 4) && ((((n + 1) % 7)) == 0) && n != 0) k++;
//     // 後半段，每行六張牌，n超過28張，因此先減28再計算，每Push六張就換行，且防止第五行馬上就換行
//     else if ((k > 3) && ((((n - 28 + 1) % 6)) == 0)) k++;
// }

// cardsGroup = shuffle(cardsGroup);
// MakeCardStr(cardsGroup);