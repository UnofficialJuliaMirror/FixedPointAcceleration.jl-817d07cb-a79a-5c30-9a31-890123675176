# FixedPointAcceleration.jl

Fixed point finders are conceptually similar to both optimisation and root finding algorithms but thus far implementations of fixed point finders have been rare in Julia. In some part this is likely because there is often an obvious method to find a fixed point by merely feeding a guessed fixed point into a function, taking the result and feeding it back into the function. By doing this repeatedly a fixed point is often found. This method (that we will call the "Simple" method) is often convergent but it is also often slow which can be prohibitive when the function itself is expensive.

**FixedPointAcceleration.jl** aims to provide fixed point acceleration algorithms that can be much faster than the simple method. In total eight algorithms are implemented. The first is the simple method as described earlier. There are also the Newton, Aitken and Scalar Epsilon Algorithm (SEA) methods that are designed for accelerating the convergence of scalar sequences. Four algorithms for accelerating vector sequences are also implemented including the Vector Epsilon Algorithm (VEA), two minimal polynomial algorithms (MPE and RRE)  and Anderson acceleration.

In this paper section 1 starts by with a brief explanation of fixed points before section 2 describes the acceleration algorithms provided by **FixedPointAcceleration.jl**. Here the goal is  to illustrate the logic underling each algorithm so users can better choose which suits their problem. Readers interested in the underlying mathematics are referred to the original papers. Section 3 then illustrates a few features of the package that enable users to better track the progress of an algorithm while it is running and switch algorithms if desired before a fixed point is found.

Section 4 then presents several applications of these fixed point algorithms in economics, asset pricing and machine learning. Finally section 5 presents a convergence comparison showing how many iterations each algorithm takes in bringing each problem to its fixed point for each of the applications presented in section 4.


```@contents
pages = ["index.md",
         "1_FixedPoints.md",
         "2_Algorithms.md",
         "3_UsingAdvice.md",
         "4_Applications.md",
         "5_TerminationConditions.md",
         "99_refs.md"]
Depth = 2
```