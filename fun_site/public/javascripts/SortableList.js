var SortableList = function(start_array) {
    this.list = start_array;
};

/**
 *  This function randomizes the internal array for re-sorting.
 *  This function has no return value and takes no parameters.
 */
SortableList.prototype.randomize = function() {
    var i = this.list.length;
    var tmp, i_rand;

    while (i !== 0) {
        i_rand = Math.floor(Math.random() * i);
        i -= 1;
        tmp = this.list[i];
        this.list[i] = this.list[i_rand];
        this.list[i_rand] = tmp;
    }
};

/**
 *  This is the merge sort function.  It takes a list as a parameter and sorts it using 
 *  the merge sort algorithm.  The algorithm is as follows:
 *  ========================================================
 *      1) If the list has one element, it is already sorted - return it
 *      2) Break the list into halves (left and right)
 *      3) Call this function recursively for both the right and left halves.  
 *         This will eventually break down into lists of 1.  Below, you will be passing both 
 *         the left and right lists into a merge function, which means that both left and right
 *         will be already sorted once the recursive call comes back.  This is good, since the
 *         merge function assumes that it is getting 2 pre-sorted lists.
 *       
 *      4) Pass the left and right lists into the merge function and return the result.
 *  ========================================================
 *
 *  @param {Array} list - An unsorted list that needs sorting
 *  @return {Array} A sorted list
 */
SortableList.prototype.merge_sort = (function () {
    /**
     *  This function performs the dirty work of comparing elements and merging smaller lists 
     *  into a larger sorted list.  It works by iterating over both the left and right lists, 
     *  comparing the smallest items in each (furthest left since they are already sorted), and 
     *  moving the smaller of the two items to the result list.  This process is repeated until
     *  all items have been moved into the result list.  At that point, the result list is returned.
     * 
     *  @param {Array} left - The left pre-sorted list to merge into the result
     *  @param {Array} right - The right pre-sorted list to merge into the result
     *  @return {Array} One sorted list containing all elements from both the left and right lists
     */
    var merge = function(left, right) {
        var result = [];
        while (left.length || right.length) {
            if (left.length && right.length) {
                if (left[0] <= right[0]) {
                    result.push(left.shift());
                } else {
                    result.push(right.shift());
                }
            } else if (left.length) {
                result.push.apply(result, left);
                break;
            } else {
                result.push.apply(result, right);
                break;
            }
        }
        return result;
    };
    
    return function() {
        var self = this;
        self.list = (function rec_ms(list) {
            /**If the list has only 1 element it is already sorted - return*/
            if (!list || list.length <= 1) {
                return list;
            }
            /**Get the center point in the list to break it in two*/
            var pivot = parseInt(list.length / 2, 10);
            /**Assign the left half to a variable*/
            var left = list.slice(0, pivot);
            /**Assign the right half to a variable*/
            var right = list.slice(pivot);
            /** Sort the left half by passing it to this function (recursive call) */
            left = rec_ms(left);
            /** Soft the right half by passing it into this function (recursive call) */
            right = rec_ms(right);
            /** Merge these two halves together into one sorted list*/
            return merge(left, right);
        })(self.list);
    }
})();

