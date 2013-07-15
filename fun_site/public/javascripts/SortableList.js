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

/**
 *  This is the Quicksort function.  It takes a list as a parameter and sorts it using the quicksort algorithm.
 *  The algorithm is as follows:
 *  ===============================================
 *      1) Given an array, and the indexes of its first and last elements:
 *      2) If the first and last indexes are equal, the array is sorted.  Return it.
 *      3) Call the partition function on the array and the 2 indexes.  The partition function will choose 
 *      the last element as the pivot element and will rearrange the array such that all elements smaller 
 *      than the pivot element are to its left and all elements greated than the pivot element are to its 
 *      right.  The partition function will return the index of the pivot element.
 *      4) Recursively call quicksort with the array and indexes that form the subarray to the left of 
 *      the pivot (first, pivot-1)
 *      5) Recursively call quicksort with the array and indexes that form the subarray to the right of 
 *      (and including) the pivot (pivot, last)
 */
SortableList.prototype.quick_sort = (function() {
    
    /**
     *  This is the partition function.  This is a key piece of the quicksort
     *  algorithm.  It works by first choosing the pivot element (last element).
     *
     *  Next, it iterates over the array in place with 2 indexes:  
     *      i - Marks the last element of the left subarray.  The left subarray
     *          contains elements smaller than or eauql to the pivot element.
     *      j - Marks the element after the end of the right subarray.  The right subarray
     *          contains elements greater than the pivot element
     *
     *  The j index always advances, and when it encounters an item smaller than the pivot, the i index is 
     *  advanced, and the element at j is swapped with the first item in the right subarray (now at i). 
     *  This operation effectively lengthens the left subarray by 1 and simply moves the first item in the 
     *  right subarray to the end of it.
     */
    var partition = function(list, first_index, last_index) {
        var last = list[last_index];
        var i = first_index - 1;
        var tmp;
        for (var j = first_index; j < last_index; j++) {
            if (list[j] <= last) {
                tmp = list[j];
                list[j] = list[++i];
                list[i] = tmp;
            }
        }
        tmp = list[last_index];
        list[last_index] = list[++i];
        list[i] = tmp;
        return i;
    };
    
    return function() {
        var self = this;
        (function rec_qs(list, first_index, last_index) {
            if (first_index >= last_index) {
                return;
            }
            var pivot = partition(list, first_index, last_index);
            rec_qs(list, first_index, pivot - 1);
            rec_qs(list, pivot, last_index);
        })(self.list, 0, self.list.length-1);
    }
})();

/**
 *  This function sorts the internal list by using the heapsort algorithm.
 *  This algorithm works by placing the elements in the array (in place) into a special
 *  binary tree called a max-heap, where every element is greater than its children.
 *  Once this tree representation is created, the list is iterated over, and roots are placed
 *  at the end of the array, one by one.  This works, because in a max-heap, the root element is
 *  always the greatest element in the heap, meaning that you always know you're getting the
 *  biggest (an next biggest) items to add to the end.
 */
SortableList.prototype.heap_sort = (function() {
    /** Keeps track of the heap size relative to the list*/
    var heap_size;
    
    /**===== HELPER FUNCTIONS FOR HEAP REPRESENTATION =====*/
     /**
     *  Returns the parent index for the
     *  given index.
     *
     *  @param {number} index - the node index
     *  @return {number} The index representing the node's parent
     */
    var parent_index = function(index) {
        return Math.floor(index / 2);
    };
    /**
     *  Returns the left child index for the
     *  given index.
     *
     *  @param {number} index - the node index
     *  @return {number} The index representing the node's left child
     */
    var left_index = function(index) {
        return 2 * index;
    };
    /**
     *  Returns the right child index for the
     *  given index.
     *
     *  @param {number} index - the node index
     *  @return {number} The index representing the node's right child
     */
    var right_index = function(index) {
        return 2 * index + 1;
    };
    /**
     *  Maintains the max-heap property for a subtree.  More specifically,
     *  this function guarantees that the root of the subtree will be larger
     *  than its children.  This function assumes that all elements in the
     *  given list are part of the heap.
     *
     *  @param {Array} list - The list representing the heap
     *  @param {number} i - The index of the current node, which represents the root of this subtree
     */
    var max_heapify = function rec_mh(list, i) {
        var largest, tmp;
        var l = left_index(i);
        var r = right_index(i);
        largest = ((l < heap_size && list[l] > list[i]) ? l : i);
        largest = ((r < heap_size && list[r] > list[largest]) ? r : largest);
        if (largest != i) {
            tmp = list[largest];
            list[largest] = list[i];
            list[i] = tmp;
            rec_mh(list, largest);
        }
    };
    
    /**
     *  Takes an array and makes it into a max-heap, where all nodes are
     *  greater than their children.  This starts by assuming that all elements 
     *  at indexes greater than n/2 are leaves of the tree and thus are all max-heaps
     *  of 1.  As a result, this function iterates on the array from index 0 to index n/2,
     *  calling max_heapify on each subtree from the bottom up.
     *
     *  @param {Array} list - The list to convert into a subheap
     */
    var build_max_heap = function(list) {
        heap_size = list.length;
        for (var i = Math.floor(list.length / 2) - 1; i>=0; i--) {
            max_heapify(list, i);
        }
    };
    
    return function() {
        var self = this;
        (function(list) {
            var tmp;
            build_max_heap(list);
            for (var i=list.length-1; i>0; i--) {
                tmp = list[i];
                list[i] = list[0];
                list[0] = tmp;
                heap_size--;
                max_heapify(list, 0);
            }
        })(self.list);
    }
})();

/**
 *  Executes the counting_sort algorithm to sort the internal list.
 *  
 * This works in linear time by using a storage array of size x where
 * x is the max *value* in the unsorted array.  A count is then kept
 * at each index in the storage array of how many elements exist in the
 * unsorted array with a value matching that index.  Once that count is 
 * complete, the storage array is iterated over and each slot is made to
 * equal the sum of its value and the value of the preceeding index.  The 
 * result of this iteration is that each index will contain the count of items
 * in the unsorted array that are greater than or equal to the value that matches
 * the index.  This data is then used to place items from the unsorted array into
 * the result array.
 */
SortableList.prototype.counting_sort = (function() {
    return function() {
        var self = this;
        self.list = (function(list) {
            if (!list || list.length <= 1) {
                return list;
            }
            var max = list[0];
            var storage = [];
            var result = [];
            /**Find max value in the list */
            for (var i = 1; i<list.length; i++) {
                max = ((list[i] > max) ? list[i] : max);
            }
            for (i = 0; i<=max; i++) {
                storage.push(0);
            }
            for (i = 0; i<list.length; i++) {
                storage[list[i]]++;
            }
            for (i = 1; i<storage.length; i++) {
                storage[i] += storage[i-1];
            }
            for (i = list.length-1; i>=0; i--) {
                result[storage[list[i]]-1] = list[i];
                storage[list[i]]--;
            }
            return result;
        })(self.list);
    };
})();

