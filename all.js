console.clear();

let data = [];

// 定錨 dom 節點
const ticketCardArea = document.querySelector('.ticketCard-area');
const regionSearch = document.querySelector('.regionSearch');
const searchResultText = document.querySelector('#searchResult-text');

const ticketName = document.querySelector('#ticketName');
const ticketImgUrl = document.querySelector('#ticketImgUrl');
const ticketRegion = document.querySelector('#ticketRegion');
const ticketPrice = document.querySelector('#ticketPrice');
const ticketNum = document.querySelector('#ticketNum');
const ticketRate = document.querySelector('#ticketRate');
const ticketDescription = document.querySelector('#ticketDescription');
const addTicketBtn = document.querySelector('.addTicket-btn');

const addTicketForm = document.querySelector('.addTicket-form');
const cantFindArea = document.querySelector('.cantFind-area');

// get 請求的資料路徑
const url = 'https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json';

// addTicket 綁定監聽 -> 新增套票功能
addTicketBtn.addEventListener('click',function(){
  let newTicket = {
    "id": data.length - 1,
    "name": ticketName.value.trim(),
    "imgUrl": ticketImgUrl.value.trim(),
    "area": ticketRegion.value,
    "description": ticketDescription.value.trim(),
    "group": Number(ticketNum.value),
    "price": Number(ticketPrice.value),
    "rate": Number(ticketRate.value)
  };
  // 將新增的套票，加入 data 中
  data.push(newTicket);
  // 清空表單的輸入框
  addTicketForm.reset();
  // 輸入完成並送出表單後，清空輸入框內容
  regionSearch.value = '';
  // 將新增的卡片 ，渲染到畫面中
  renderTickets(data)
  // 將新增套票後的 data，再次計算
  countAreaNum(data)
})

// function handleRender(item){
//   renderTickets(item);
//   renderChart(item)
// }


// 監聽下拉選單 regionSearch
regionSearch.addEventListener('change', function(){
  // 全部地區
  if (regionSearch.value === ''){
    renderTickets(data);
  }
  // 特定地區
  else {
    let filterData = [];
    data.forEach(function(ticket){
      if (ticket.area === regionSearch.value ){
        filterData.push(ticket);
      }
    });
    renderTickets(filterData);
    
    // 查無關鍵字
    if (filterData.length === 0){
      cantFindArea.style.display = 'block'
    }
  }
});

// 將 data/filterData 中的資料，加入到卡片中
function renderTickets(tickets){
  let ticketList = '';
  //將每一筆 data 中 ticket (也就是item) 加入到 ticketList 字串中
  tickets.forEach(function(ticket){
    ticketList += `<li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${ticket.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${ticket.area}</div>
          <div class="ticketCard-rank">${ticket.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${ticket.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${ticket.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${ticket.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${ticket.price}</span>
            </p>
          </div>
        </div>
      </li>`;
  });
  // 將 ticketList 的內容，渲染到畫面上
  ticketCardArea.innerHTML = ticketList;
  // 同步修改 searchResultText 的總數
  searchResultText.textContent = `本次搜尋共 ${tickets.length} 筆資料`;
}

// 渲染圖表
function renderChart(newData){
  const chart = c3.generate({
    bindto: '#chart',
    data: {
      type: 'donut',
      columns: newData
    },
    size: {
      width: 160,
      height: 160
    },
    color: {
      pattern: ['#26C0C7', '#5151D3', '#E68618']
    },
    donut: {
      label: {
        show: false
      },
      width: 10
    }
  });
}

// var chart = c3.generate({
//     bindto: '#chart',
//     data: {
//       columns: [
//         ['data1', 30, 200, 100, 400, 150, 250],
//         ['data2', 50, 20, 10, 40, 15, 25]
//       ]
//     }
// });

// 將 data 整理成 c3.js 格式
// 計算地區
function countAreaNum(array){
  let totalObj = {};
  data.forEach(item => {
    if(totalObj[item.area] === undefined) {
      totalObj[item.area] = 1
    }
    else [
      totalObj[item.area] += 1
    ]
  })
  console.log(totalObj)
  // output: {高雄: 1, 台北: 1, 台中: 1}
  const areaAry = Object.entries(totalObj);
  console.log(areaAry);
  // output: [['高雄', 1], ['台北', 1], ['台中', 1]]
  renderChart(areaAry);
  
};

// 撈取資料並渲染畫面
async function getData() {
  try {
    const response = await axios.get(url);
    data = response.data.data;
    console.log(data);
    renderTickets(data);
    countAreaNum(data);
  }
  catch (error) {
    console.log('發生錯誤，回傳失敗')
  }
};


// function getData(){
//   axios.get(url)
//   .then(function(response){
//     data = response.data.data;
//     renderTickets(data);
//   })
//   .catch(function(error){
//     console.log('發生錯誤，回傳失敗')
//   })
// }

getData();
