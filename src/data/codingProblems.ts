export interface CodingProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: {
    javascript: string;
    python: string;
  };
  solutionCode: {
    javascript: string;
    python: string;
  };
}

export const codingProblems: CodingProblem[] = [
  {
    id: "1",
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    difficulty: "easy",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Write your code here
    
}

// Parse input
const input = "nums = [2,7,11,15], target = 9";
const numsMatch = input.match(/nums = \[(.*?)\]/);
const targetMatch = input.match(/target = (\d+)/);
const nums = numsMatch ? numsMatch[1].split(',').map(Number) : [];
const target = targetMatch ? parseInt(targetMatch[1]) : 0;

// Call function and print result
const result = twoSum(nums, target);
console.log(JSON.stringify(result));`,
      python: `def two_sum(nums, target):
    # Write your code here
    pass

# Parse input
input_str = "nums = [2,7,11,15], target = 9"
nums_str = input_str.split('nums = [')[1].split(']')[0]
nums = [int(x.strip()) for x in nums_str.split(',')]
target = int(input_str.split('target = ')[1])

# Call function and print result
result = two_sum(nums, target)
print(result)`
    },
    solutionCode: {
      javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
      python: `def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`
    }
  },
  {
    id: "2",
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "easy",
    examples: [
      {
        input: "s = \"()\"",
        output: "true"
      },
      {
        input: "s = \"()[]{}\"",
        output: "true"
      },
      {
        input: "s = \"(]\"",
        output: "false"
      }
    ],
    starterCode: {
      javascript: `function isValid(s) {
    // Write your code here
    
}

// Parse input
const input = 's = "()"';
const sMatch = input.match(/s = "(.*)"/);
const s = sMatch ? sMatch[1] : '';

// Call function and print result
const result = isValid(s);
console.log(JSON.stringify(result));`,
      python: `def is_valid(s):
    # Write your code here
    pass

# Parse input
input_str = 's = "()"'
s = input_str.split('s = "')[1].split('"')[0]

# Call function and print result
result = is_valid(s)
print(result)`
    },
    solutionCode: {
      javascript: `function isValid(s) {
    const stack = [];
    const map = {
        ')': '(',
        '}': '{',
        ']': '['
    };
    
    for (let char of s) {
        if (!map[char]) {
            stack.push(char);
        } else if (stack.pop() !== map[char]) {
            return false;
        }
    }
    return stack.length === 0;
}`,
      python: `def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`
    }
  },
  {
    id: "3",
    title: "Longest Palindromic Substring",
    description: `Given a string s, return the longest palindromic substring in s.
A string is palindromic if it reads the same forward and backward.`,
    difficulty: "medium",
    examples: [
      {
        input: "s = \"babad\"",
        output: "\"bab\"",
        explanation: "\"aba\" is also a valid answer."
      },
      {
        input: "s = \"cbbd\"",
        output: "\"bb\""
      }
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {
    // Write your code here
    
}

// Parse input
const input = 's = "babad"';
const sMatch = input.match(/s = "(.*)"/);
const s = sMatch ? sMatch[1] : '';

// Call function and print result
const result = longestPalindrome(s);
console.log(JSON.stringify(result));`,
      python: `def longest_palindrome(s):
    # Write your code here
    pass

# Parse input
input_str = 's = "babad"'
s = input_str.split('s = "')[1].split('"')[0]

# Call function and print result
result = longest_palindrome(s)
print(result)`
    },
    solutionCode: {
      javascript: `function longestPalindrome(s) {
    let start = 0;
    let maxLength = 1;
    
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            if (right - left + 1 > maxLength) {
                start = left;
                maxLength = right - left + 1;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i);
        expandAroundCenter(i, i + 1);
    }
    
    return s.substring(start, start + maxLength);
}`,
      python: `def longest_palindrome(s):
    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]
    
    if not s:
        return ""
    
    longest = ""
    for i in range(len(s)):
        odd = expand_around_center(i, i)
        even = expand_around_center(i, i + 1)
        longest = max(longest, odd, even, key=len)
    
    return longest`
    }
  },
  {
    id: "4",
    title: "Container With Most Water",
    description: `Given n non-negative integers a1, a2, ..., an , where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of the line i is at (i, ai) and (i, 0). Find two lines, which, together with the x-axis forms a container, such that the container contains the most water.`,
    difficulty: "medium",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation: "The maximum area is obtained by choosing height[1] = 8 and height[8] = 7"
      },
      {
        input: "height = [1,1]",
        output: "1"
      }
    ],
    starterCode: {
      javascript: `function maxArea(height) {
    // Write your code here
    
}

// Parse input
const input = "height = [1,8,6,2,5,4,8,3,7]";
const heightMatch = input.match(/height = \[(.*?)\]/);
const height = heightMatch ? heightMatch[1].split(',').map(Number) : [];

// Call function and print result
const result = maxArea(height);
console.log(JSON.stringify(result));`,
      python: `def max_area(height):
    # Write your code here
    pass

# Parse input
input_str = "height = [1,8,6,2,5,4,8,3,7]"
height_str = input_str.split('height = [')[1].split(']')[0]
height = [int(x.strip()) for x in height_str.split(',')]

# Call function and print result
result = max_area(height)
print(result)`
    },
    solutionCode: {
      javascript: `function maxArea(height) {
    let maxArea = 0;
    let left = 0;
    let right = height.length - 1;
    
    while (left < right) {
        const currentArea = Math.min(height[left], height[right]) * (right - left);
        maxArea = Math.max(maxArea, currentArea);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxArea;
}`,
      python: `def max_area(height):
    max_area = 0
    left = 0
    right = len(height) - 1
    
    while left < right:
        current_area = min(height[left], height[right]) * (right - left)
        max_area = max(max_area, current_area)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_area`
    }
  },
  {
    id: "5",
    title: "Merge K Sorted Lists",
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.
Merge all the linked-lists into one sorted linked-list and return it.`,
    difficulty: "hard",
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation: "The linked-lists are: [1->4->5, 1->3->4, 2->6] merging them into one sorted list: 1->1->2->3->4->4->5->6"
      },
      {
        input: "lists = []",
        output: "[]"
      }
    ],
    starterCode: {
      javascript: `function mergeKLists(lists) {
    // Write your code here
    
}

// Parse input
const input = "lists = [[1,4,5],[1,3,4],[2,6]]";
const listsMatch = input.match(/lists = \[(.*)\]/);
const lists = listsMatch ? JSON.parse('[' + listsMatch[1] + ']') : [];

// Call function and print result
const result = mergeKLists(lists);
console.log(JSON.stringify(result));`,
      python: `def merge_k_lists(lists):
    # Write your code here
    pass

# Parse input
input_str = "lists = [[1,4,5],[1,3,4],[2,6]]"
lists_str = input_str.split('lists = ')[1]
lists = eval(lists_str)

# Call function and print result
result = merge_k_lists(lists)
print(result)`
    },
    solutionCode: {
      javascript: `function mergeKLists(lists) {
    if (!lists || lists.length === 0) return null;
    
    const mergeTwoLists = (l1, l2) => {
        if (!l1) return l2;
        if (!l2) return l1;
        
        if (l1.val < l2.val) {
            l1.next = mergeTwoLists(l1.next, l2);
            return l1;
        } else {
            l2.next = mergeTwoLists(l1, l2.next);
            return l2;
        }
    };
    
    while (lists.length > 1) {
        const mergedLists = [];
        for (let i = 0; i < lists.length; i += 2) {
            const l1 = lists[i];
            const l2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(l1, l2));
        }
        lists = mergedLists;
    }
    
    return lists[0];
}`,
      python: `def merge_k_lists(lists):
    if not lists:
        return None
        
    def merge_two_lists(l1, l2):
        if not l1:
            return l2
        if not l2:
            return l1
            
        if l1.val < l2.val:
            l1.next = merge_two_lists(l1.next, l2)
            return l1
        else:
            l2.next = merge_two_lists(l1, l2.next)
            return l2
    
    while len(lists) > 1:
        merged_lists = []
        for i in range(0, len(lists), 2):
            l1 = lists[i]
            l2 = lists[i + 1] if i + 1 < len(lists) else None
            merged_lists.append(merge_two_lists(l1, l2))
        lists = merged_lists
    
    return lists[0]`
    }
  },
  {
    id: "6",
    title: "Longest Valid Parentheses",
    description: `Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.`,
    difficulty: "hard",
    examples: [
      {
        input: "s = \"(()\"",
        output: "2",
        explanation: "The longest valid parentheses substring is \"()\"."
      },
      {
        input: "s = \")()())\"",
        output: "4",
        explanation: "The longest valid parentheses substring is \"()()\"."
      }
    ],
    starterCode: {
      javascript: `function longestValidParentheses(s) {
    // Write your code here
    
}

// Parse input
const input = 's = "(()"';
const sMatch = input.match(/s = "(.*)"/);
const s = sMatch ? sMatch[1] : '';

// Call function and print result
const result = longestValidParentheses(s);
console.log(JSON.stringify(result));`,
      python: `def longest_valid_parentheses(s):
    # Write your code here
    pass

# Parse input
input_str = 's = "(()"'
s = input_str.split('s = "')[1].split('"')[0]

# Call function and print result
result = longest_valid_parentheses(s)
print(result)`
    },
    solutionCode: {
      javascript: `function longestValidParentheses(s) {
    let maxLen = 0;
    const stack = [-1];
    
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push(i);
        } else {
            stack.pop();
            if (stack.length === 0) {
                stack.push(i);
            } else {
                maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
            }
        }
    }
    
    return maxLen;
}`,
      python: `def longest_valid_parentheses(s):
    max_len = 0
    stack = [-1]
    
    for i in range(len(s)):
        if s[i] == '(': 
            stack.append(i)
        else:
            stack.pop()
            if not stack:
                stack.append(i)
            else:
                max_len = max(max_len, i - stack[-1])
    
    return max_len`
    }
  }
]; 