/**
 * Created by mac on 17/12/31.
 */

class CacheManage {
    constructor() {
        this.caches = {};
    }
    
    getCache(id) {
        return this.caches[id];
    }
    
    setCache(id, data) {
        this.caches[id] = data;
    }
    
    removeCache(id) {
        delete this.caches[id];
    }
}

module.exports = new CacheManage();