import testRespApi from '../testRespApi.json' assert {type: 'json'}


const goToAvtoriz = () => window.location.href = '../index.html';
checkAvtTime(1)
function checkAvtTime(n) {
    // нужно будет удалить из функци n
    if (!window.localStorage.userProps) {
        goToAvtoriz();
    }
    if (new Date().getDate() !== JSON.parse(localStorage.userProps).date) {
        alert(`Vremia ovtarizacii isteklo
        Neobxodimo povtorno avtorizovatsia`);
        window.localStorage.clear();
        goToAvtoriz();
    }
    else {
        console.log(`proverenno ${n} raz nachalo ${new Date().getHours() + ':' + new Date().getMinutes()}`);
    }
    setTimeout(() => {
        checkAvtTime(n + 1)
    }, 3600000);
}
function toAvt() {
    window.localStorage.clear();
    goToAvtoriz();
}
const logOut = document.querySelector('.logOut');
logOut.addEventListener('click', () => toAvt());

const logOutM = document.querySelector('.logOutMedia');
logOutM.addEventListener('click', () => toAvt());

function createList() {
    let { key: apiKey, date } = JSON.parse(window.localStorage.getItem('userProps'))
    // запрос на получения листа menu 
    fetch('http://httpbin.org/anything',)
        .then(manue => {
            let myManue = testRespApi[2];
            // запрос на получения листа заказов 
            // и информацию об заведение таких как меню,адрес,название... 
            // так как api недоступен буду использовать json testRespApi
            // где должен быть премьерно тлт объект который должно было прийти
            fetch('http://httpbin.org/anything',)
                .then(res => {
                    if (res.ok) {
                        let resp = testRespApi[1];
                        const ordList = document.querySelector('.orderList');
                        ordList.innerHTML = '';
                        resp.forEach(({ id, Type, fullName, SalePointId, Address, Date, Items }, index) => {
                            // let prace = 0
                            // Items.forEach((it) => {
                            //     prace += it.Price * it.Amount;

                            // });

                            ordList.innerHTML += `<div class="order allOrds" id='${id}'>
                   <div class="forId">
                       <span>${id}</span>
                   </div>
                   <div class="orderName">
                       <span>${fullName}</span>
                   </div>
                   <div class="ordAdres">
                       <span>${Date}</span>
                   </div>
                   <div class="forTools">
                       <button class="staBtn myPops" id='${index}'>Собрать</button>
                   </div>
                   </div>`;
                            const mod = document.querySelector('#module');
                            const body = document.getElementsByTagName('body');
                            const modCont = document.querySelector('.moduleContent');
                            const popContent = document.querySelector('.notFixedContent');
                            const modBody = document.querySelector('.moduleBody')
                            const allPops = document.querySelectorAll('.myPops');
                            const modCloseBtn = document.querySelector('.closeBtn');
                            allPops.forEach(it => it.addEventListener('click', open = (e) => {
                                body[0].style.overflow = 'hidden';
                                mod.classList.add('modOpen');
                                modCont.classList.add('moduleConOpen');
                                popContent.innerHTML = ` <div class="ordId">
                                <h3 class='zakazId'><span style="font-weight: 500;">Id Заказа: </span>${resp[e.target.id].id}</h3>
                            </div>
                            <div class="ords"></div>`;
                                let myCrosInfo = []
                                let ordsConteiner = document.querySelector('.ords');
                                resp[e.target.id].Items.forEach(zakProd => {
                                    myManue.forEach(it => {
                                        if (it.id == zakProd.MenuItemId) {
                                            myCrosInfo.push([it, zakProd]);
                                            let toolLipBtnDiv = document.querySelector('.subBtn');
                                            toolLipBtnDiv.innerHTML = `<button class="uk-button uk-button-primary"
                                           uk-tooltip="title:Не полностью собран; delay: 500">Закрыт заказ</button>`

                                            ordsConteiner.innerHTML += `<div class="des">
                                            <span><input type="checkbox"style="pointer-events:none" name="complit" id="compEd"></span>
                                            <h4>${it.name}</h4>
                                            <h5 class="price_amou">${it.price}$(<span class='forCheck'>${zakProd.Amount}</span>)</h5>
                                            <span>Добавлен(<span id='${zakProd.MenuItemId}' class="amInZak">${0}</span>)</span>
                                            <button class="scanBtn" id='${myCrosInfo.length - 1}' type="button" uk-toggle="target: #modal-example"><i class="fa-solid fa-qrcode"></i></button>
                                            </div>`;
                                            if (window.localStorage.getItem(resp[e.target.id].id)) {
                                                let trInfo = JSON.parse(window.localStorage.getItem(resp[e.target.id].id))
                                                console.log(trInfo, 'etiEsa');
                                                let itInputs = document.querySelectorAll('.amInZak');
                                                itInputs.forEach((it, ind) => it.innerHTML = trInfo.at(-1)[ind]);

                                            }
                                            ifCompited();
                                        }
                                    })
                                })

                                function ifCompited() {
                                    let shuldBe = document.querySelectorAll('.forCheck');
                                    let isNow = document.querySelectorAll('.amInZak');
                                    let coplitInputs = document.querySelectorAll('#compEd');
                                    let flag = 0;
                                    coplitInputs.forEach((item, index) => {
                                        if (shuldBe[index].innerHTML == isNow[index].innerHTML) {
                                            item.checked = true;
                                            flag += 1;
                                        }
                                        else {
                                            item.checked = false;
                                        }

                                    })
                                    if (coplitInputs.length == flag) {
                                        let toolLipBtnDiv = document.querySelector('.subBtn');
                                        toolLipBtnDiv.innerHTML = `<button class="uk-button uk-button-primary subOrder"
                                       uk-tooltip="title:Собран полностью !; delay: 500">Закрыт заказ</button>`;
                                        let subOrderBtn = document.querySelector('.subOrder');
                                        subOrderBtn.addEventListener('click', () => {
                                            body[0].style.overflow = 'visible';
                                            mod.classList.remove('modOpen');
                                            modCont.classList.remove('moduleConOpen');
                                            let responsObj = {
                                                orderId: resp[e.target.id].id,
                                                isRedy: true,
                                            }
                                            fetch('http://httpbin.org/anything', {
                                                method: 'POST',
                                                body: responsObj,
                                            }).then(res => {
                                                if (res.ok) {
                                                    window.localStorage.removeItem(resp[e.target.id].id)
                                                }
                                            })
                                                .catch(err => console.log(err))
                                        })
                                    }

                                }
                                console.log(myCrosInfo, 'mycrosinfo');
                                //! scaner scripts
                                function onScanSuccess(qrCodeMessage) {
                                    console.log(myCrosInfo, '1');
                                    let f = 0
                                    myCrosInfo.forEach(zakItems => {
                                        if (zakItems[0].id == qrCodeMessage) {
                                            return f++
                                        }
                                    })
                                    if (f == 0) {
                                        alert('Этот продукт не входит в заказ ')
                                        return
                                    }
                                    console.log(myCrosInfo[1], '3');
                                    myManue.forEach(it => {
                                        if (it.id == qrCodeMessage) {
                                            document.getElementById('result').innerHTML = ` <div style="
                                            padding: 10px;
                                            font-size: 15px;
                                            height: 100%;">

                                            <span class="result" style="
                                             padding: 10px; 
                                            font-size: 15px;
                                            height: 100%;
                                            max-width: 30%;
                                            overflow: hidden;
                                            margin-right: 10px;"> ${it.name} </span>
                                            <span class='control'>
                                            <i class="fa-solid fa-minus minIt" style="color:red"></i>
                                            <span id="${qrCodeMessage}"
                                             style="margin: 0px 10px;" class='amItems'>${0}</span>
                                            <i class="fa-solid fa-plus plItem"></i>
                                            </span>
                                          </div>`;

                                            let itemKol = document.querySelector('.amItems');
                                            let minus = document.querySelector('.minIt');
                                            let plus = document.querySelector('.plItem');


                                            let saveBtn = document.querySelector('.subChanges');
                                            saveBtn.addEventListener('click', function seveChanges() {
                                                console.log(myCrosInfo);
                                                console.log(itemKol.innerHTML);
                                                let allNumInp = document.querySelectorAll('.amInZak');
                                                let allFcheckInps = document.querySelectorAll('#compEd')
                                                allNumInp.forEach((it, id) => {
                                                    if (itemKol.id == it.id) {
                                                        it.innerHTML = itemKol.innerHTML;
                                                        allFcheckInps[id].checked = true;
                                                    }
                                                })
                                                ifCompited();
                                            });

                                            function addItems() {
                                                let amount;
                                                myCrosInfo.forEach(it => {
                                                    if (it[0].id == itemKol.id) {
                                                        amount = it[1].Amount;
                                                    }
                                                })
                                                console.log(amount);
                                                if (itemKol.innerHTML == amount) {
                                                    return
                                                }
                                                itemKol.innerHTML = +itemKol.innerHTML + 1
                                                ifCompited();
                                            }
                                            function minusItem() {
                                                if (itemKol.innerHTML == 0) {
                                                    return
                                                }
                                                itemKol.innerHTML = +itemKol.innerHTML - 1;
                                                ifCompited();
                                            }
                                            minus.addEventListener('click', () => minusItem())
                                            plus.addEventListener('click', () => addItems())
                                        }
                                    })
                                }
                                // let saveInLocalBtn = document.querySelector('.saveInLocal');
                                // saveInLocalBtn.addEventListener('click', )
                                function save() {
                                    let idofOrder = document.querySelector('.zakazId').innerText.split(' ').at(-1);
                                    console.log(idofOrder, 'ordId');
                                    let curentInf = Array.from(document.querySelectorAll('.amInZak')).map(it => it.innerHTML);
                                    let orderPos = [...myCrosInfo, curentInf];
                                    window.localStorage.setItem(idofOrder, JSON.stringify(orderPos))
                                }
                                function onScanError(errorMessage) {
                                    // handle scan error
                                }

                                var html5QrcodeScanner = new Html5QrcodeScanner(
                                    "reader", { fps: 10, qrbox: 250 });
                                html5QrcodeScanner.render(onScanSuccess, onScanError);

                                modCloseBtn.addEventListener('click', function close(e) {
                                    body[0].style.overflow = 'visible';
                                    mod.classList.remove('modOpen');
                                    modCont.classList.remove('moduleConOpen');
                                    save()
                                    modBody.addEventListener('click', (e) => {
                                        console.log(e.target.classList[0]);
                                        if (e.target.classList[0] == 'moduleBody') {
                                            close(e)
                                        }
                                    })
                                })

                            }))
                            // !scaner scripts


                        });
                    }
                    console.log('done')
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}
createList();
document.querySelector('.reloud').addEventListener('click', () => createList());
document.querySelector('.reloudInMedia').addEventListener('click', () => createList());
let serchBtn = document.querySelector('.serch')
serchBtn.addEventListener('click', () => {
    document.querySelector('.serchBar').classList.remove('serchPop');
    serchBtn.classList.add('serchPop')
})

document.querySelector('.serchOrdClose').addEventListener('click', () => {
    document.querySelector('.serchBar').classList.add('serchPop');
    serchBtn.classList.remove('serchPop')
})

let serchPost = document.querySelector('.sBtn');

serchPost.addEventListener('click', function serchOrder(e) {
    let textInp = document.querySelector('#serchOrd');
    let allOrds = document.querySelectorAll('.allOrds');
    allOrds.forEach(it => {
        it.style.display = ''
        console.log(it.id, textInp);
        if (it.id !== textInp.value) {
            it.style.display = 'none';
        }
    })
})
let serchPostMedia = document.querySelector('.sBtnMedia');
serchPostMedia.addEventListener('click', function serchOrderM(e) {
    let textInp = document.querySelector('#serchOrdMedia');
    let allOrds = document.querySelectorAll('.allOrds');
    allOrds.forEach(it => {
        it.style.display = ''
        console.log(it.id, textInp);
        if (it.id !== textInp.value) {
            it.style.display = 'none';
        }
    })
})
