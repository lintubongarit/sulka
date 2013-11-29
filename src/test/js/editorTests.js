casper.test.begin('EditorTests', function EditorTests(test) {
	var ArrayTreeCompletionTestsTriplets = [
  	    [
  	     	[ "a" ],
  	     	{ "a": true }, 
  	     	{ "": [ "a" ], a: [ "a" ], b: [] }
  	    ], [
  	        [ "a", "b", "c" ],
	     	{ a: true, b: true, c: true } ,
  	     	{ "": ["a", "b", "c"], a: [ "a" ], b: [ "a" ], c: [ "c" ], d: [] }
	    ], [
  	        [ "", "a", "b", "c" ],
	        { "": true, a: true, b: true, c: true },
  	     	{ "": ["", "a", "b", "c"], a: [ "a" ], b: [ "a" ], c: [ "c" ], d: [] }
	    ], [
	     	[ "aaa", "aab", "aac", "b", "c" ],
	        { aa: { a: true, b: true, c: true }, b: true, c: true },
  	     	{ 
	        	"": [ "aaa", "aab", "aac", "b", "c" ], 
	        	a: [ "aaa", "aab", "aac" ],
	        	aa: [ "aaa", "aab", "aac" ],
	        	aaa: [ "aaa" ],
	        	aab: [ "aab" ],
	        	aaba: [ ],
	        	abba: [ ],
	        	b: [ "b" ], 
	        	c: [ "c" ]
  	     	}
	  	], [
	     	[ "aaa", "aba", "aca", "b", "c" ],
	  	    { a: { aa: true, ba: true, ca: true }, b: true, c: true },
	  	    {
	  	    	a: [ "aaa", "aba", "aca" ],
	  	    	aa: [ "aaa" ]
	  	    }
	    ], [
	  	    [ "aaa", "aaab", "aaac", "b", "c" ],
	        { aaa: { "": true, b: true, c: true }, b: true, c: true },
	  	    {
	  	    	a: [ "aaa", "aaab", "aaac" ],
	  	    	aa: [ "aaa", "aaab", "aaac" ],
	  	    	aaa: [ "aaa", "aaab", "aaac" ],
	  	    	aaaa: [  ],
	  	    	aaad: [  ],
	  	    	aaab: [ "aaab" ],
	  	    }
		], [
	        [ "aaa", "aaaba", "aaaca", "b", "c" ],
		    { aaa: { "": true, ba: true, ca: true }, b: true, c: true },
		    {
		    	a: [ "aaa", "aaaba", "aaaca" ],
		    	aa: [ "aaa", "aaaba", "aaaca" ],
		    	aaa: [ "aaa", "aaaba", "aaaca" ],
		    	aaab: [ "aaaba" ],
	    		aaaba: [ "aaaba" ],
	    		aaac: [ "aaaca" ],
	    		aaaca: [ "aaaca" ]
		    }
		], [
		    [ "a", "ab", "aba", "abb" ],
		    { a: { "": true, b: { "": true, a: true, b: true } } }
		], [
		    [ "a", "aa", "aaba", "aabb" ],
		    { a: { "": true, a: { "": true, b: { a: true, b: true } } } },
		    {
		    	"": [ "a", "aa", "aaba", "aabb" ],
		    	a: [ "a", "aa", "aaba", "aabb" ],
		    	aa: [ "aa", "aaba", "aabb" ],
		    	aab: [ "aaba", "aabb" ],
	    		aaba: [ "aaba" ],
    			aabab: [ ]
		    }
		 ], [
			[ "aaa", "aaabba", "aaabbc", "aab" ],
			{ aa: { a: { "": true, bb: { a: true, c: true } }, b: true } },
			{
				"": [ "aaa", "aaabba", "aaabbc", "aab" ],
				a: [ "aaa", "aaabba", "aaabbc", "aab" ],
				aa: [ "aaa", "aaabba", "aaabbc", "aab" ],
				aaa: [ "aaa", "aaabba", "aaabbc" ],
				aab: [ "aab" ],
				aaab: [ "aaabba", "aaabbc" ],
				aaabb: [ "aaabba", "aaabbc" ],
				aaabbd: [  ]
			}
		], [
		    [ "aaa", "aaabba", "aaabbc", "aab", "baa", "b", "c" ],
		    { aa: { a: { "": true, bb: { a: true, c: true } }, b: true }, b: { "": true, aa: true }, c: true },
		    {
		    	"": [ "aaa", "aaabba", "aaabbc", "aab", "baa", "b", "c" ],
		    	a: [ "aaa", "aaabba", "aaabbc", "aab" ],
		    	b: [ "b", "baa" ],
		    	ba: [ "baa" ],
		    	bab: [ ],
		    	c: [ "c" ],
		    	ca: [ ],
		    	ac: [ ]
		    }
		], [
		    [ "aaa", "aaabba", "aaabbb", "aaba", "aabbc", "aabcca", "aabccb", "aabccc", "aad" ],
		    { aa: { 
		    	a: { "": true, bb: { a: true, b: true } }, 
		    	b: { a: true, bc: true, cc: { a: true, b: true, c: true } }, 
		    	d: true 
		    } },
		    {
		    	"": [ "aaa", "aaabba", "aaabbb", "aaba", "aabbc", "aabcca", "aabccb", "aabccc", "aad" ],
		    	a: [ "aaa", "aaabba", "aaabbb", "aaba", "aabbc", "aabcca", "aabccb", "aabccc", "aad" ],
		    	aa: [ "aaa", "aaabba", "aaabbb", "aaba", "aabbc", "aabcca", "aabccb", "aabccc", "aad" ],
		    	aaa: [ "aaa", "aaabba", "aaabbb"],
		    	aab: [ "aaba", "aabbc", "aabcca", "aabccb", "aabccc" ],
		    	aad: [ "aad" ],
		    	aaba: [ "aaba" ],
		    	aaab: [ "aaabba", "aaabbb"],
		    	aabb: [ "aabbc"],
		    	aabc: [ "aabcca", "aabccb", "aabccc" ]
		    }
		] 
	];
	
    browse('/addRingings', function () {
    	test.begin("PrefixTreeTests", ArrayTreeCompletionTestsTriplets.length, function PrefixTreeTests(test) {
    		function getTree(array) {
    			return casper.evaluate(function (array) {
    				return (new sulka.editors._PrefixTree(array))._root;
    			}, array);
    		}
    		
    		function getCompletions(array, prefix) {
    			return casper.evaluate(function (array, prefix) {
    				return (new sulka.editors._PrefixTree(array)).getCompletions(prefix);
    			}, array, prefix);
    		}
    		
    		ArrayTreeCompletionTestsTriplets.forEach(function (ArrayTreeCompletionTests) {
	    		var options = ArrayTreeCompletionTests[0];
	    		var expectedTree = ArrayTreeCompletionTests[1];
	    		var completionTests = ArrayTreeCompletionTests[2];
	    		
	    		test.assertEquals(getTree(options), expectedTree, "Array is transformed into expected prefix tree.");
	    		
	    		if (completionTests) {
		    		for (var prefix in completionTests) if (completionTests.hasOwnProperty(prefix)) {
		    			test.begin("CompletionTest", 1, function (test) {
		    				test.assertEquals(getCompletions(options, prefix), completionTests[prefix],
		    						"Prefix " + prefix + " expands to expected set of completions");
		    				test.done();
		    			});
		    		}
	    		}
	    	});
	    	test.done();
    	});
    });
    
    casper.run(function () {
        test.done();
   	});
});