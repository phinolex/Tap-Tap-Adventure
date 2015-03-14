/* global Types */

define(['npc'], function(Npc) {
    var NPCs = {
        King: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.KING, 1);
                this.beforeQuestCompleteTalk = [
                    ["Cthulhu kinapped our Meyl princess."],
                    ["Please save her"]
                ];
            }
        }),
        VillageGirl: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VILLAGEGIRL, 1);
                this.beforeQuestCompleteTalk = [
                    ["Help me please! These mice have been eating all our food!"],
                    ["Kill 10 for me and I will reward you."]
                ];
                this.afterQuestCompleteTalk = [
                    ["Potatoes are guud."]
                ];
            }
        }),
        Villager: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VILLAGER, 1);
                this.beforeQuestCompleteTalk = [
                    ["Ex..cu..se me. I really want to become a warrior."],
                    ["Can you please give me one leather armor?"]
                ];
                this.afterQuestCompleteTalk = [
                    ["Thank you."],
                ];
            }
        }),
        BeachNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BEACHNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["Hey there warrior! I can't have fun in the beach due to the crabs."],
                    ["Could you please kill five crabs for me?"],
                ];
                this.afterQuestCompleteTalk = [
                    ["Thank you."],
                ];
            }
        }),
        Agent: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.AGENT, 1);
                this.beforeQuestCompleteTalk = [
                    ["Buddy, just lost my cake for my girlfriend, dude."],
                    ["Today is her birthday bro..."],
                ];
                this.afterQuestCompleteTalk = [
                    ["Thank you."],
                ];
            }
        }),
        Nyan: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.NYAN, 1);
                this.idleSpeed = 50;
                this.beforeQuestCompleteTalk = [
                    ["Meow Meow. Please find my Nyan song CD."],
                ];
                this.afterQuestCompleteTalk = [
                    ["Meow Meow. Thank you."],
                ];
            }
        }),
        Rick: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.RICK, 1);
                this.beforeQuestCompleteTalk = [
                    ["Shake that body! Shake that body!"],
                ];
            }
        }),
        Priest: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.PRIEST, 1);
                this.beforeQuestCompleteTalk = [
                    ["Damn those skeletons! Can't focus on my meditation!"],
                    ["Please slaughter 10 skeletons."],
                ];
                this.afterQuestCompleteTalk = [
                    ["Thank you."],
                ];
            }
        }),
        Guard: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.GUARD, 1);
                this.beforeQuestCompleteTalk = [
                    ["How are you?"],
                    ["Fine. Thank you."],
                    ["Got some item today?"],
                    ["Good luck"],
                ];
            }
        }),
        Scientist: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SCIENTIST, 1);
                this.beforeQuestCompleteTalk = [
                    ["이 옆에 있는 굴로 가면 쥐굴로 갈 수 있다던데,",
                     "This door will lead you to the mouse dungeon."],
                    ["자네가 가서 오크 10놈만 잡아줄 수 있겠나?",
                     "Slaugher 10 orcs for me."],
                    ["응? 왜 내가 가지 않냐고?",
                     "I want to do it by myself."],
                    ["이거 창피한 이야기지만 내가 폐쇄공포증이거든!",
                     "This is a shame but i got Claustrophobia."],
                    ["그리고 이걸 성공하면 자넨 5%의 회피 기술을 얻게 되네.",
                     "If you suceed, I will provide you 5 perc of avoidability passive skill to you."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙네.",
                     "Thank you."],
                ];
            }
        }),
        DesertNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.DESERTNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["도끼를 잃어버렸어요...",
                     "I've lost my axe today..."],
                    ["도끼 좀 찾아주시면 안 될까요?",
                     "I want my axe back..."],
                ];
                this.afterQuestCompleteTalk = [
                    ["감사합니다.",
                     "Thank you."],
                ];
            }
        }),
        LavaNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.LAVANPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["친구... 왔는가... 공주를 구하는 길을 해골왕이 막고 있다네...",
                     "Hey my comrade, there is a skeleton blocking its way to the princess."],
                    ["해골왕을 죽여 주게... 두 번 죽여 주게...",
                     "Crash it, crash it twice!"],
                    ["한 번은 나의 몫, 또 한 번은 너의 몫",
                     "one for you,.. and one for me."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙네... 친구여...",
                     "Thank you, my comrade..."],
                ];
            }
        }),
        Boxingman: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BOXINGMAN, 1);
                this.beforeQuestCompleteTalk = [
                    ["훗!훗!훗! 나는 회피연습 중이지.",
                     "Shu! Shu! I'm just practicing to avoid attacks."],
                    ["골렙을 10마리 잡아준다면 자네에게 5% 더 회피할 수 있는 기술을 알려주지.",
                     "If you can kill 10 golems, 5 perc of avoidability passive skill for ya."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙네.",
                     "Thank you."],
                ];
            }
        }),
        Vampire: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VAMPIRE, 1);
                this.beforeQuestCompleteTalk = [
                    ["요즘 홉고블린들이 너무 나댄단 말이야...",
                     "There are lots of Hob goblins around nowadays and it has been bothering me for days."],
                    ["오... 자네 혹시 홉고블린 13마리를 잡아준다면,",
                     "If you kill 13 Hob goblins,"],
                    ["흡혈 스킬을 알려주지.",
                     "5 perc of bloodsucking will be part of your passive skill."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙네.",
                     "Thank you."],
                ];
            }
        }),
        Doctor: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.DOCTOR, 1);
                this.beforeQuestCompleteTalk = [
                    ["실험용 노란쥐가 필요해서 그런데",
                     "I need to find more mice to proceed my investigation."],
                    ["자네 혹시 노란쥐 12마리를 잡아줄 수 있겠나?",
                     "Could you kill 12 yellow mice."],
                    ["그럼 내가 5% 더 흡혈할 수 있는 기술을 알려주지.",
                     "Then I will teach you 5 perc of bloodsucking as your passive."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙네.",
                     "Thank you."],
                ];
            }
        }),
        Oddeyecat: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ODDEYECAT, 1);
                this.beforeQuestCompleteTalk = [
                    ["쥐갑 좀 구해주지 않겠냥?",
                     "Can you give me a rat armor, meow?"],
                    ["내..내가 입으려는 건 아니당.",
                     "It... It's not for my wearing.. meow."],
                    ["5% 더 회피할 수 있는 스킬도 알려주까냥?",
                     "Can I teach you avoidability skill 5 percentile more, meow?"],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙다냥!",
                     "Thank you, meow."],
                ];
            }
        }),
        Sorcerer: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SORCERER, 1);
                this.idleSpeed = 150;
                this.beforeQuestCompleteTalk = [
                    ["나는 대마법사 우엨앙!",
                     "I am The Great Wizard Wu Ek Ang!"],
                    ["벌써 120년이 지났나...",
                     "120 years have passed..."],
                    ["마법사가 되고 싶다고?",
                     "Do you wanna become a wizard."],
                    ["자네는 이미 자격이 충분해 보이는구만..",
                     "You are already a wizard..."],
                ];
            }
        }),
        Coder: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.CODER, 1);
                this.beforeQuestCompleteTalk = [
                    ["몬스터 25마리, 100마리, 200마리, 500마리를 잡아오면, 포션 100개, 버거 100개, 철쭉 50개, 스노우포션 1개를 매일 주겠네.",
                     "If you kill 25, 100, 200, 500 monsters for me, I'll give you 100 potions, 100 burgers, 50 royal azalea and 1 snow potions."],
                    ["단, 자신의 레벨 절반이상의 레벨을 가진 몬스터만 유효하네.",
                     "But it counts only when the monster's level is more than half of yours."],
                ];
            }
        }),
        ForestNpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FORESTNPC, 1);
            }
        }),
        Octocat: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.OCTOCAT, 1);
                this.beforeQuestCompleteTalk = [
                    ["망치를 구해주면 크리티컬 스트라이크를 가르쳐주겠다냥!",
                     "If you give me a hammer, I'll teach you critical strike skill, meow"],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙다냥!",
                     "Thank you, meow."],
                ];
            }
        }),
        Soldier: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SOLDIER, 1);
                this.beforeQuestCompleteTalk = [
                    ["우리 부대가 인어요괴에게 유혹을 당해 모..몰살을...",
                     "Mermaid monsters killed all my comrades...."],
                    ["자네가 혹시 인어 15마리를 잡아준다면",
                     "If you kill 15 mermaid monsters,"],
                    ["더 강한 크리트컬 스트라이크를 알려주겠네.",
                     "I will teach you more strong critical strike skill."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙네...",
                     "Thank you..."],
                ];
            }
        }),
        Fisherman: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FISHERMAN, 1);
                this.beforeQuestCompleteTalk = [
                    ["요즘 리빙아머들이 너무 많이 출몰해서 낚시를 못하고 있네...",
                     "In these days, I can't fish because of living armors..."],
                    ["혹시 리빙아머 9마리만 잡아준다면",
                     "If you kill 9 living armors,"],
                    ["흡혈을 5% 더 할 수 있게 해주겠네.",
                     "I will teach you more strong bloodsucking skill."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고맙네.",
                     "Thank you."],
                ];
            }
        }),
        Octopus: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.OCTOPUS, 1);
                this.beforeQuestCompleteTalk = [
                    ["어서와~ 해저는 처음이지?",
                     "Welcome~ First time under the sea?"],
                    ["흉포한 펭귄을 12마리 잡아준다면",
                     "If you skill 12 ferocious penguins,"],
                    ["미끌미끌하게 회피율을 5% 올려주지",
                     "I will teach you more slithery avoidability skill."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워~",
                     "Thank you~"],
                ];
            }
        }),
        Mermaidnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MERMAIDNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["다크 스켈레톤들이 우리 인어들을 너무 많이 죽이고 있어.",
                     "Dark skeletons are killing mermaids..."],
                    ["다크 스켈레톤 20마리만 잡아줄래?",
                     "Can you skill 20 dark skeletons?"],
                    ["그럼 내가 힐링 스킬을 알려줄께.",
                     "Then I will teach you healing skill."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워.",
                     "Thank you."],
                ];
            }
        }),
        Sponge: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SPONGE, 1);
                this.beforeQuestCompleteTalk = [
                    ["미니 나이트 30마리만 잡아줄래?",
                     "Can you skill 30 mini knights?"],
                    ["그럼 내가 5% 더 흡혈할 수 있는 스킬을 알려줄께.",
                     "Then I will teach you more strong bloodsucking skill."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워.",
                     "Thank you."],
                ];
            }
        }),
        Fairynpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FAIRYNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["빨강형광등 좀 가져다줄래?",
                     "Can you give me red light saber?"],
                    ["그럼 내가 크리티컬 스트라이크를 한 단계 업그레이드 시켜줄께.",
                     "Then I will upgrade your critical strike skill."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워.",
                     "Thank you."],
                ];
            }
        }),
        Shepherdboy: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SHEPHERDBOY, 1);
                this.beforeQuestCompleteTalk = [
                    ["늑대다! 늑대가 나타났다!",
                     "Wolves! Wolves!"],
                    ["늑대를 50마리 잡아주세요.",
                     "Please kill 50 wolves."],
                ];
                this.afterQuestCompleteTalk = [
                    ["감사합니다.",
                     "Thank you."],
                ];
            }
        }),
        Zombiegf: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ZOMBIEGF, 1);
                this.beforeQuestCompleteTalk = [
                    ["사랑하는 남자친구가 좀비가 되어버렸어요",
                     "My boyfriend became a zombie..."],
                    ["우리가 매일같이 즐겨입던 파란 커플티를 기억하고 있을까요?",
                     "Does he remember our blue pair T-shirt?"],
                ];
                this.afterQuestCompleteTalk = [
                    ["감사합니다.",
                     "Thank you."],
                ];
            }
        }),
        Pirategirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.PIRATEGIRLNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["오빠, 나 바스타드 사 줘",
                     "Honey, buy me a bastard sword."],
                    ["얼마 안 해",
                     "It's cheap."],
                ];
                this.afterQuestCompleteTalk = [
                    ["우리 헤어져.",
                     "We need to break up."],
                    ["왜 헤어지려는지 몰라서 물어?",
                     "Don't you know why?"],
                ];
            }
        }),
        Bluebikinigirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUEBIKINIGIRLNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["남자친구가 게를 잡으러 갔다가 사라졌어",
                     "My boyfriend is lost!"],
                    ["전체 채팅으로 어디있는지 물어봐야겠어",
                     "I need to ask where he is by global chatting"],
                    ["전체 채팅: /1 할 말",
                     "To chat globally: /1 text"],
                ];
            }
        }),
        Redbikinigirlnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDBIKINIGIRLNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["오빠, 나 살쪘어?",
                     "Hey~"],
                    ["아이, 참 오빠두.. 내 질문에 먼저 대답해야지.",
                     "What a beautiful day today~"],
                    ["낄 수 있는 장비의 순서를 보고싶으면 우측 하단에 ? 아이콘을 눌러봐.",
                     "To see the order of items, press the ? mark on the right bottom side of the screen."],
                    ["이제 대답해봐. 나 살쪘어?",
                     "Have a nice day~"],
                ];
            }
        }),
        Iamverycoldnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.IAMVERYCOLDNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["추워요.. 내가 추워요..",
                     "Cold... I am cold..."],
                    ["안아줘요.. 꼭 안아줘요..",
                     "Hug... Hug me..."],
                    ["레드메탈소드의 불꽃으로 날 따뜻하게 해줘요..",
                     "Make me warm by the flare of red metal sword.."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워요.",
                     "Thank you."],
                ];
            }
        }),
        Iceelfnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ICEELFNPC, 1);
                this.beforeQuestCompleteTalk = [
					["얼음성에는 영원히 시들지 않는 꽃이 있다던데",
                     "I heard there is a flower that does not wilt forever in the ice castle..."],
					["아름다운 나를 위해 얼음장미를 구해줄 수 있니?",
                     "Can you bring me a ice rose?"],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워.",
                     "Thank you."],
                ];
            }
        }),
        Elfnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ELFNPC, 1);
                this.beforeQuestCompleteTalk = [
					["공주는 있어요.",
                     "The princess is real."],
					["숨겨진 엘프의 보물, 숲의 수호자 검을 노리던 크툴루가 공주를 끌고 자림에 들어왔었는데",
                     "Cthulhu, who has aimed a forest guardian sword the hidden valuable of elves, brought the princess to the purple forest."],
					["포레스트 드래곤이 그만 먹어버렸지 뭐에요..",
                     "A forest dragon ate it.."],
					["어떻게 찾지?..",
                     "How can I get it?"],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워요.",
                     "Thank you."],
                ];
            }
        }),
        Snowshepherdboy: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SNOWSHEPHERDBOY, 1);
                this.beforeQuestCompleteTalk = [
					["주둥이가 길고 네 발로 걷는 하얀 늑대가",
                     "There are too many snow wolves.."],
					["어린 양을 물어다가 어디론가 도망쳤어!!",
                     "They are always hunting my sheep.."],
					["날씨가 너무 추워서 보는 것처럼 난 꼼짝도 못하니",
                     "Buy it's too cold to move as you see."],
					["네가 가서 두 번 다시는 그러지 못하도록",
                     "Could you do me a favor?"],
					["그 녀석들 60마리만 혼내줄래?",
                     "Can you kill 60 snow wolves?"],
                ];
                this.afterQuestCompleteTalk = [
                    ["감사합니다.",
                     "Thank you."],
                ];
            }
        }),
        Angelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
					["설녀들이 환생하려고 하는 영혼들을 괴롭히고 있어.",
                     "Snowladies are oppressing souls who want to revive."],
					["더 이상 설녀들을 내버려 두면 내 실적은 떨어지고",
                     "If they continues, my achievement will falls"],
					["다음달 내 월급은 감봉될지도 몰라!!",
                     "And My salary will be reduced!!"],
					["반드시 그 사태만은 막아야해!!",
                     "I must stop it."],
					["가서 설녀 70마리만 혼내줄래?",
                     "Can you kill 70 snowladies?"],
                ];
                this.afterQuestCompleteTalk = [
                    ["감사합니다.",
                     "Thank you."],
                ];
            }
        }),
        Momangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MOMANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
					["애들 아빠가 또 직장을 땡땡이치고",
                     "I heard that my hushand skipped out"],
					["이 근처에 숨어있다는 이야기를 들었어.",
                     "and he is hiding himself here."],
					["분명 날 보면, 멀리서부터 도망칠텐데..",
                     "If he see me, he'll run away..."],
					["아무래도 서리갑옷을 입고 변장한 뒤 덮쳐야겠어.",
                     "I'd better to wear a frostarmor as a disguise. "],
					["난 이 길목을 지키고 있어야 하니",
                     "Because I have to watch here"],
					["네가 가서 서리갑옷 하나만 구해다 줄래?",
                     "Can you bring me a frostarmor?"],
					["서리갑옷을 구해다주면 스턴스킬 향상과 함께",
                     "If you do that, I'll give 2 level stun skill"],
					["앞으로 꼭 필요할 지도 모르는 힌트를 하나 줄게",
                     "and a hint for you."],
                ];
                this.afterQuestCompleteTalk = [
                    ["힌트는 장난꾸러기에게 계속 말을 걸라는 거야.",
                     "The hint is to keep talking to the mischievous boy."],
                ];
            }
        }),
        Superiorangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SUPERIORANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
					["회사를 땡땡이 친 부하직원이 이쯤 어딘가 있다고 하던데..",
                     "I heard that my subordinate skipped out."],
					["내 생각엔 분명 이 굴 속에 있을 거 같아",
                     "I think he is in this cave."],
					["난 부하직원이 도망치는 것을 대비해",
                     "I'll be here"],
					["이 굴 입구에서 지키고 있을테니",
                     "to catch him if he run away."],
					["네가 들어가서 부하직원이 있나없나 살펴보고",
                     "Enter the cave and look for him."],
					["여기저기 꼼꼼하게 살펴보았다는 증거로",
                     "And bring shadow region armor"],
					["섀도우 레기온 갑옷을 하나 가져와줘.",
                     "as the evidence that you look for carefully."],
					["그럼 내가 널 누구보다 빠르게 만들어줄께",
                     "Then I'll make you speedy."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워.",
                     "Thanks."],
                ];
            }
        }),
        Firstsonangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.FIRSTSONANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
					["브레이커를 가져와줘.",
                     "Bring me a breaker."],
					["너의 불꽃의 춤 스킬을 4단계로 업그레이드 해줄게",
                     "Then, I'll upgrade your flare dance skill to level 4."],
                ];
                this.afterQuestCompleteTalk = [
                    ["고마워.",
                     "Thanks."],
                ];
            }
        }),
        Secondsonangelnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.SECONDSONANGELNPC, 1);
                this.beforeQuestCompleteTalk = [
			["I wanna go to an internet cafe"],
			["while mom looks for dad."],
			["I'm afraid that meet with mom on the way to the internet cafe."],
			["Can you bring me a dambo armor?"],
			["in order that mom can't recognize me.."],
                ];
                this.afterQuestCompleteTalk = [
                    ["Thanks."]
                ];
            }
        }),
        Mojojojonpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.MOJOJOJONPC, 1);
                this.beforeQuestCompleteTalk = [
			["Mind deposing of some Wind Ladies for me?"],
			["As well as bring me a typhoon and squid armour?."],
			["One of each is enough."],
			["I will reward you by upgrading your Supercat skill to level 2."]
                ];
                this.afterQuestCompleteTalk = [
                    ["Thanks."]
                ];
            }
        }),
        Ancientmanumentnpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.ANCIENTMANUMENTNPC, 1);
                this.beforeQuestCompleteTalk = [
                    ["Memme will OO you..."],
                    ["..."]
                ];
                this.afterQuestCompleteTalk = [
                    ["Memme will bless you..."]
                ];
            }
        }),


        Vendingmachine: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.VENDINGMACHINE, 1);
            }
        }),
        Redstoremannpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.REDSTOREMANNPC, 1);
            }
        }),
        Bluestoremannpc: Npc.extend({
            init: function(id) {
                this._super(id, Types.Entities.BLUESTOREMANNPC, 1);
            }
        })
    };
    
    return NPCs;
});