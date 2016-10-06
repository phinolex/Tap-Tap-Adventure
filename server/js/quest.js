/**
 * Created by flavius on 2016-09-26.
 */

var cls = require('./lib/class'),
    Quests = require('./questdata');

module.exports = Quest = cls.Class.extend({
    init: function(questId) {
        this.data = Quests.QuestData[questId];
    },

    getLength: function() {
        return Object.keys(this.data.states).length;
    },

    getExpReward: function() {
        return this.data.expReward;
    },

    getItemReward: function() {
        var itemArr = [];
        itemArr.push(this.data.itemReward);
        itemArr.push(this.data.itemRewardCount);

        return itemArr;
    }
});