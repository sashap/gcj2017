# Problem C. Bathroom Stalls

## Problem

A certain bathroom has N + 2 stalls in a single row; the stalls on the left and right ends are permanently occupied by the bathroom guards. The other N stalls are for users.

Whenever someone enters the bathroom, they try to choose a stall that is as far from other people as possible. To avoid confusion, they follow deterministic rules: For each empty stall S, they compute two values LS and RS, each of which is the number of empty stalls between S and the closest occupied stall to the left or right, respectively. Then they consider the set of stalls with the farthest closest neighbor, that is, those S for which min(LS, RS) is maximal. If there is only one such stall, they choose it; otherwise, they choose the one among those where max(LS, RS) is maximal. If there are still multiple tied stalls, they choose the leftmost stall among those.

K people are about to enter the bathroom; each one will choose their stall before the next arrives. Nobody will ever leave.

When the last person chooses their stall S, what will the values of max(LS, RS) and min(LS, RS) be?

Solving this problem

This problem has 2 Small datasets and 1 Large dataset. You must solve the first Small dataset before you can attempt the second Small dataset. You will be able to retry either of the Small datasets (with a time penalty). You will be able to make a single attempt at the Large, as usual, only after solving both Small datasets.

Input

The first line of the input gives the number of test cases, T. T lines follow. Each line describes a test case with two integers N and K, as described above.

Output

For each test case, output one line containing Case #x: y z, where x is the test case number (starting from 1), y is max(LS, RS), and z is min(LS, RS) as calculated by the last person to enter the bathroom for their chosen stall S.

Limits

1 ≤ T ≤ 100.
1 ≤ K ≤ N.
Small dataset 1

1 ≤ N ≤ 1000.
Small dataset 2

1 ≤ N ≤ 10^6.
Large dataset

1 ≤ N ≤ 10^18.


Sample

```text
Input

5
4 2
5 2
6 2
1000 1000
1000 1

Output

Case #1: 1 0
Case #2: 1 0
Case #3: 1 1
Case #4: 0 0
Case #5: 500 499
```

In Case #1, the first person occupies the leftmost of the middle two stalls, leaving the following configuration (O stands for an occupied stall and . for an empty one): O.O..O. Then, the second and last person occupies the stall immediately to the right, leaving 1 empty stall on one side and none on the other.

In Case #2, the first person occupies the middle stall, getting to O..O..O. Then, the second and last person occupies the leftmost stall.

In Case #3, the first person occupies the leftmost of the two middle stalls, leaving O..O...O. The second person then occupies the middle of the three consecutive empty stalls.

In Case #4, every stall is occupied at the end, no matter what the stall choices are.

In Case #5, the first and only person chooses the leftmost middle stall.


## Solution

Initial implementation involving arrays and looping has complexity O(n), where n is the number of people.  It relies on representing available stalls as an array of counts, where each count represents number of continuous available stalls.  This array remains sorted in descending order, with largest available stall group counts listed first.  As next person comes in, they select first element from the array, and by occupying on of the middle stalls in that group split it into two smaller sub-groups of remaining available stall counts.  These new counts get inserted in an ordered way toward the end of the array.  Groups of size 0 are dropped.  This approach produces correct results for `C-small-practice-1.in` practice set.  However, it takes too long to run for larger problem sets.

Second though was to solve it mathematically, but initial formula was naive, and there were some agreements, but many disagreements with the results in the loop approach.  Here is an example of comparing the two across multiple sizes of N and K:

```bash
for n in {1..1000}; do for k in {1..100}; do if [ $k -gt $n ]; then continue; fi; mathResult=`echo -ne "1\n$n $k" | node c.js --solver math`; loopResult=`echo -ne "1\n$n $k" | node c.js --solver loop`; if [ "${mathResult}" != "${loopResult}" ]; then echo "N: $n K: $k MISMATCH: Math: $mathResult Loop: $loopResult"; fi;  done; done
```

Results in following mismatches:

```
N: 5 K: 3 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 7 K: 3 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 8 K: 3 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 9 K: 3 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 9 K: 5 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 10 K: 3 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 10 K: 6 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 11 K: 3 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 2
N: 11 K: 6 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 11 K: 7 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 12 K: 3 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 2 2
N: 12 K: 7 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 13 K: 3 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 3 2
N: 13 K: 5 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 13 K: 7 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 14 K: 3 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 3 2
N: 14 K: 5 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 14 K: 6 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 15 K: 3 MISMATCH: Math: Case #1: 2 2 Loop: Case #1: 3 3
N: 15 K: 6 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 15 K: 7 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 16 K: 3 MISMATCH: Math: Case #1: 2 2 Loop: Case #1: 3 3
N: 16 K: 6 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 16 K: 7 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 17 K: 3 MISMATCH: Math: Case #1: 2 2 Loop: Case #1: 4 3
N: 17 K: 5 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 17 K: 6 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 17 K: 7 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 17 K: 9 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 18 K: 3 MISMATCH: Math: Case #1: 3 2 Loop: Case #1: 4 3
N: 18 K: 5 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 18 K: 6 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 18 K: 7 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 18 K: 10 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 19 K: 3 MISMATCH: Math: Case #1: 3 2 Loop: Case #1: 4 4
N: 19 K: 5 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 19 K: 6 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 19 K: 7 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 2 1
N: 19 K: 10 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 19 K: 11 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 20 K: 3 MISMATCH: Math: Case #1: 3 2 Loop: Case #1: 4 4
N: 20 K: 6 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 20 K: 7 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 2 1
N: 20 K: 11 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 20 K: 12 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 21 K: 3 MISMATCH: Math: Case #1: 3 3 Loop: Case #1: 5 4
N: 21 K: 5 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 2 2
N: 21 K: 6 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 21 K: 7 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 21 K: 11 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 21 K: 12 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 21 K: 13 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 22 K: 3 MISMATCH: Math: Case #1: 3 3 Loop: Case #1: 5 4
N: 22 K: 5 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 2 2
N: 22 K: 6 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 2
N: 22 K: 7 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 1
N: 22 K: 12 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 22 K: 13 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 22 K: 14 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 23 K: 3 MISMATCH: Math: Case #1: 3 3 Loop: Case #1: 5 5
N: 23 K: 5 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 2 2
N: 23 K: 6 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 2
N: 23 K: 7 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 2
N: 23 K: 12 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 23 K: 13 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 23 K: 14 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 23 K: 15 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 24 K: 3 MISMATCH: Math: Case #1: 4 3 Loop: Case #1: 5 5
N: 24 K: 5 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 2 2
N: 24 K: 6 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 2 2
N: 24 K: 7 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 2
N: 24 K: 13 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 24 K: 14 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 24 K: 15 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 25 K: 3 MISMATCH: Math: Case #1: 4 3 Loop: Case #1: 6 5
N: 25 K: 5 MISMATCH: Math: Case #1: 2 2 Loop: Case #1: 3 2
N: 25 K: 6 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 2 2
N: 25 K: 7 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 2
N: 25 K: 9 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 25 K: 13 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 25 K: 14 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 25 K: 15 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 26 K: 3 MISMATCH: Math: Case #1: 4 3 Loop: Case #1: 6 5
N: 26 K: 5 MISMATCH: Math: Case #1: 2 2 Loop: Case #1: 3 2
N: 26 K: 6 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 3 2
N: 26 K: 7 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 2 2
N: 26 K: 9 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 26 K: 10 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 26 K: 14 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 26 K: 15 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 27 K: 3 MISMATCH: Math: Case #1: 4 4 Loop: Case #1: 6 6
N: 27 K: 5 MISMATCH: Math: Case #1: 2 2 Loop: Case #1: 3 2
N: 27 K: 6 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 3 2
N: 27 K: 7 MISMATCH: Math: Case #1: 1 1 Loop: Case #1: 3 2
N: 27 K: 10 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 27 K: 11 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 27 K: 14 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 27 K: 15 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
N: 28 K: 3 MISMATCH: Math: Case #1: 4 4 Loop: Case #1: 6 6
N: 28 K: 5 MISMATCH: Math: Case #1: 2 2 Loop: Case #1: 3 2
N: 28 K: 6 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 3 2
N: 28 K: 7 MISMATCH: Math: Case #1: 2 1 Loop: Case #1: 3 2
N: 28 K: 10 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 28 K: 11 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 28 K: 12 MISMATCH: Math: Case #1: 1 0 Loop: Case #1: 1 1
N: 28 K: 15 MISMATCH: Math: Case #1: 0 0 Loop: Case #1: 1 0
...
```
