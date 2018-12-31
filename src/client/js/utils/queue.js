/* global _ */

define(function() {
  /**
   * Very useful file used for queuing various objects,
   * most notably used in the info controller to queue
   * objects to delete
   */

  return Class.extend({
    constructor() {
      var self = this;

      self.queue = [];
    },

    reset() {
      this.queue = [];
    },

    add(object) {
      this.queue.push(object);
    },

    getQueue() {
      return this.queue;
    },

    forEachQueue(callback) {
      _.each(this.queue, function(object) {
        callback(object);
      });
    }
  });
});
