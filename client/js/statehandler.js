
define(['jquery'], function() {
    var StateHandler = Class.extend({
        init: function(game) {
            this.game = game;
            this.buyingArcher = false;
            this.changingPassword = false;
            this.curHoldingRef = null;
            this.newCurHoldingRef = null;
        },
        initState: function(pubPoint, refData, newRefData, children, exps){
            var self = this;
            var htmlStr = '<table>';

            htmlStr += '<tr><td>리뷰포인트</td><td>' + pubPoint + '</td></tr>';
            htmlStr += '<tr><td>리뷰 링크</td><td>' + this.getPubAddress() + '</td></tr>';

            if(children.length){
                htmlStr += '<tr><td>내 리뷰로 온 분들</td><td>';
                var i=0;
                for(i=0; i<children.length; i++){
                    htmlStr += children[i] + '(' + Types.getLevel(exps[i]) + '),';
                }
                htmlStr += '</td></tr>';
            }

            htmlStr += '</table>';

            if(refData.length){
                htmlStr += '<table>';
                htmlStr += '<tr><td>리뷰 링크</td><td>포인트</td><td>확인/거부</td></tr>';

                var i = 0;
                for(i=0; i<refData.length; i += 2){
                    htmlStr += '<tr><td><a href="' + refData[i] + '" target="_blank">' + refData[i] + '</a></td>';
                    htmlStr += '<td>' + refData[i+1] + '</td>';
                    if(i === 0){
                        htmlStr += '<td><div id="pubacceptbutton">확인</div><div id="pubrejectbutton">거부</div></td></tr>';
                        this.curHoldingRef = refData[i];
                    } else{
                        htmlStr += '<td></td></tr>';
                    }
                }

                htmlStr += '</table>';
            }
            if(newRefData.length){
                htmlStr += '<table>';
                htmlStr += '<tr><td>리뷰 주소</td><td>확인/거부</td></tr>';

                var i=0;
                for(i=0; i<newRefData.length; i++){
                    htmlStr += '<tr><td><a href="' + newRefData[i] + '" target="_blank">' + newRefData[i] + '</a></td>';
                    if(i === 0){
                        htmlStr += '<td><div id="newpubacceptbutton">확인</div><div id="newpubrejectbutton">거부</div></td></tr>';
                        this.newCurHoldingRef = newRefData[i];
                    } else{
                        htmlStr += '<td></td></tr>';
                    }
                }
                htmlStr += '</table>';
            }

            htmlStr += '<p></p><p>리뷰포인트 쇼핑~</p>';

            htmlStr += '<p></p><div id="buyinventorybutton">인벤토리 한 칸 사기(100)</div>';
            htmlStr += '<p></p><div id="buysnowpotionbutton">스노우 포션 사기(50)</div>';
            htmlStr += '<p></p><div id="buyarcherbutton">궁수 사기(100)</div>';
            htmlStr += '<p></p><div id="buyrainbowaprobutton">레인보우 아프로 사기(20)</div>';
            htmlStr += '<p></p><div id="buycokearmorbutton">분신술 콜라 코스튬 사기(20)</div>';
            htmlStr += '<p></p><div id="buyfriedpotatoarmorbutton">암살자 감자튀김 코스튬 사기(50)</div>';
            htmlStr += '<p></p><div id="buyburgerarmorbutton">닌자 버거 코스튬 사기(80)</div>';
            htmlStr += '<p></p><div id="buyradisharmorbutton">무갑옷 사기(20)</div>';
            htmlStr += '<p></p><div id="buyhalloweenjkarmorbutton">할로윈JK갑옷 사기(20)</div>';
            htmlStr += '<p></p><div id="buyfrankensteinarmorbutton">프랑켄슈타인 갑옷 사기(20)</div>';

            htmlStr += '<p></p><div id="passwordchangebutton">비밀번호 변경</div>';

            $('#state').html(htmlStr);
            $('#state').css('display', 'block');

            if(refData.length){
                $('#pubacceptbutton').click(function(event){
                    if(self.curHoldingRef){
                        self.game.client.sendHoldingPubPoint('accept', self.curHoldingRef);
                    }
                });
                $('#pubrejectbutton').click(function(event){
                    if(self.curHoldingRef){
                        self.game.client.sendHoldingPubPoint('reject', self.curHoldingRef);
                    }
                });
            }
            if(newRefData.length){
                $('#newpubacceptbutton').click(function(event){
                    if(self.newCurHoldingRef){
                        self.game.client.sendHoldingPubPoint('newaccept', self.newCurHoldingRef);
                    }
                });
                $('#newpubrejectbutton').click(function(event){
                    if(self.newCurHoldingRef){
                        self.game.client.sendHoldingPubPoint('newreject', self.newCurHoldingRef);
                    }
                });
            }

            if(pubPoint >= 100){
                $('#buyinventorybutton').click(function(event){
                    self.game.client.sendState('buyinventory');
                });
            }
            if(pubPoint >= 50){
                $('#buysnowpotionbutton').click(function(event){
                    self.game.client.sendState('buysnowpotion');
                });
            }
            if(pubPoint >= 5){
                $('#buyroyalazaleabutton').click(function(event){
                    self.game.client.sendState('buyroyalazalea');
                });
            }
            if(pubPoint >= 20){
                $('#buyrainbowaprobutton').click(function(event){
                    self.game.client.sendState('buyrainbowapro');
                });
            }
            if(pubPoint >= 20){
                $('#buycokearmorbutton').click(function(event){
                    self.game.client.sendState('buycokearmor');
                });
            }
            if(pubPoint >= 50){
                $('#buyfriedpotatoarmorbutton').click(function(event){
                    self.game.client.sendState('buyfriedpotatoarmor');
                });
            }
            if(pubPoint >= 80){
                $('#buyburgerarmorbutton').click(function(event){
                    self.game.client.sendState('buyburgerarmor');
                });
            }
            if(pubPoint >= 20){
                $('#buyradisharmorbutton').click(function(event){
                    self.game.client.sendState('buyradisharmor');
                });
            }
            if(pubPoint >= 20){
                $('#buyhalloweenjkarmorbutton').click(function(event){
                    self.game.client.sendState('buyhalloweenjkarmor');
                });
            }
            if(pubPoint >= 20){
                $('#buyfrankensteinarmorbutton').click(function(event){
                    self.game.client.sendState('buyfrankensteinarmor');
                });
            }


            if(pubPoint >= 90){
                $('#buyarcherbutton').click(function(event){
                    self.showBuyArcher();
                });
            }
            $('#passwordchangebutton').click(function(event){
                self.showPasswordChange();
            });
        },
        show: function(){
            var htmlStr = '<table>';

            htmlStr += '<tr><td>레벨</td><td>' + this.game.player.level + '</td></tr>';
            htmlStr += '<tr><td>경험치</td><td>' + this.game.player.experience + '</td></tr>';

            htmlStr += '</table>';

            $('#state').html(htmlStr);
            $('#state').css('display', 'block');
        },
        hide: function(){
            this.buyingArcher = false;
            this.changingPassword = false;
            $('#state').css('display', 'none');
        },
        format: function(num){
            if(num >= 10000){
                return num;
            } else if(num >= 1000){
                return "0" + num;
            } else if(num >= 100){
                return "00" + num;
            } else if(num >= 10){
                return "000" + num;
            } else{
                return "0000" + num;
            }
        },
        getPubAddress: function(){
            var nickname = this.game.player.name;

            var i = 0;
            var result = "";

            for(i=0; i<nickname.length; i++){
                result += this.format(nickname.charCodeAt(i));
            }

            return "http://burgerburger.kr/index.py?no=" + result;
        },
        handleState: function(message){
            var type = message.shift();
            if(type === 'show'){
                var pubPoint = parseInt(message.shift());
                pubPoint = isNaN(pubPoint) ? 0 : pubPoint;
                var refHoldData = message.shift();
                var newRefHoldData = message.shift();
                var children = message.shift();
                var exps = message.shift();
                this.initState(pubPoint, refHoldData, newRefHoldData, children, exps);
            } else if(type === 'maxInventoryNumber'){
                this.game.inventoryHandler.setMaxInventoryNumber(parseInt(message[0]));
                this.game.shopHandler.setMaxInventoryNumber(parseInt(message[0]));
            }
        },
        showPasswordChange: function(){
            var self = this;
            this.changingPassword = true;
            $('#state').html('<table>'
                + '<tr><td>현재 비밀번호</td><td><input type="password" id="curpwinput" class="stroke" placeholder="현재 비밀번호" maxlength="16"></td></tr>'
                + '<tr><td>새 비밀번호</td><td><input type="password" id="newpwinput" class="stroke" placeholder="새 비밀번호" maxlength="15"></td></tr>'
                + '<tr><td>새 비밀번호 확인</td><td><input type="password" id="newpwinput2" class="stroke" placeholder="새 비밀번호 확인" maxlength="15"></td></tr>'
                + '<tr><td>이메일 주소</td><td><input type="text" id="newpwemailinput" class="stroke" placeholder="이메일 주소" maxlength="48"></td></tr>'
                + '</table>'
                + '<div id="sendpasswordchangebutton">비밀번호 변경</div>');
            $('#sendpasswordchangebutton').click(function(event){
                var curpw = $('#curpwinput').val();
                var newpw = $('#newpwinput').val();
                var newpw2 = $('#newpwinput2').val();
                var email = $('#newpwemailinput').val();

                if(!curpw || !newpw || !newpw2 || !email){
                    alert("비밀번호나 이메일을 입력하지 않으셨습니다.");
                    return;
                }
                if(newpw !== newpw2){
                    alert("비밀번호 칸과 비밀번호 확인칸에 입력하신 비밀번호가 다릅니다.");
                    return;
                }
                self.game.client.sendPasswordChange(self.game.cry(curpw), self.game.cry(newpw), email);
            });
        },
        showBuyArcher: function(){
            var self = this;
            this.buyingArcher = true;
            $('#state').html('<table>'
                + '<tr><td>ID</td><td><input type="text" id="archernameinput" class="stroke" placeholder="닉네임(한글, 영문, 숫자)" maxlength="8"></td></tr>'
                + '<tr><td>PW</td><td><input type="password" id="archerpwinput" class="stroke" placeholder="비밀번호" maxlength="15"></td></tr>'
                + '<tr><td>PW2</td><td><input type="password" id="archerpwinput2" class="stroke" placeholder="비밀번호 확인" maxlength="15"></td></tr>'
                + '<tr><td>EMAIL</td><td><input type="text" id="archeremailinput" class="stroke" placeholder="이메일(비번변경시 사용, 필수 아님)" maxlength="48"></td></tr>'
                + '</table>'
                + '<div id="sendbuyarcherbutton">궁수 사기(90)</div>');
            $('#sendbuyarcherbutton').click(function(event){
                var name = $('#archernameinput').val();
                var pw = $('#archerpwinput').val();
                var pw2 = $('#archerpwinput2').val();
                var email = $('#archeremailinput').val();

                if(!name || !pw || !pw2){
                    alert("닉네임이나 비밀번호를 입력하지 않으셨습니다.");
                    return;
                }
                if(pw !== pw2){
                    alert("비밀번호 칸과 비밀번호 확인칸에 입력하신 비밀번호가 다릅니다.");
                    return;
                }
                self.game.client.sendNewCharacter(name, self.game.cry(pw), email);
            });

        },
    });

    return StateHandler;
});
