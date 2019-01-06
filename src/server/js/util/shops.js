import _ from 'underscore';

export default class ShopsDictionary {
  constructor() {
    this.shops = {};
    this.data = {};
  }

  isShopNPC(npcId) {
    return this.shops[npcId];
  }

  getItems(id) {
    return this.shops[id].items;
  }

  getItemCount(id) {
    return this.getItems(id).length;
  }

  /**
   * Reason for the shopId variable is because some shops
   * may have different prices for the same item. A way to
   * spice up the game.
   */
  getCost(shopId, itemId, count) {
    const shop = this.shops[shopId];
    const index = shop.items.indexOf(itemId);

    if (!index) {
      return -1;
    }

    return shop.prices[index] * count;
  }

  getCount(id) {
    const {
      count,
    } = this.shops[id];
    const counts = [];

    if (_.isArray(count)) {
      return count;
    }

    for (let i = 0; i < this.getItemCount(id); i += 1) {
      counts.push(count);
    }

    return counts;
  }
}
