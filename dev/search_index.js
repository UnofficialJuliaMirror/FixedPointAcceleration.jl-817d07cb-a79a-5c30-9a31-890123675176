var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "FixedPointAcceleration.jl",
    "title": "FixedPointAcceleration.jl",
    "category": "page",
    "text": ""
},

{
    "location": "#FixedPointAcceleration.jl-1",
    "page": "FixedPointAcceleration.jl",
    "title": "FixedPointAcceleration.jl",
    "category": "section",
    "text": "Fixed point finders are conceptually similar to both optimisation and root finding algorithms but thus far implementations of fixed point finders have been rare in Julia. In some part this is likely because there is often an obvious method to find a fixed point by merely feeding a guessed fixed point into a function, taking the result and feeding it back into the function. By doing this repeatedly a fixed point is often found. This method (that we will call the \"Simple\" method) is often convergent but it is also often slow which can be prohibitive when the function itself is expensive.FixedPointAcceleration.jl aims to provide fixed point acceleration algorithms that can be much faster than the simple method. In total eight algorithms are implemented. The first is the simple method as described earlier. There are also the Newton, Aitken and Scalar Epsilon Algorithm (SEA) methods that are designed for accelerating the convergence of scalar sequences. Four algorithms for accelerating vector sequences are also implemented including the Vector Epsilon Algorithm (VEA), two minimal polynomial algorithms (MPE and RRE)  and Anderson acceleration.In this paper section 1 starts by with a brief explanation of fixed points before section 2 describes the acceleration algorithms provided by FixedPointAcceleration.jl. Here the goal is  to illustrate the logic underling each algorithm so users can better choose which suits their problem. Readers interested in the underlying mathematics are referred to the original papers. Section 3 then illustrates a few features of the package that enable users to better track the progress of an algorithm while it is running and switch algorithms if desired before a fixed point is found.Section 4 then presents several applications of these fixed point algorithms in economics, asset pricing and machine learning. Finally section 5 presents a convergence comparison showing how many iterations each algorithm takes in bringing each problem to its fixed point for each of the applications presented in section 4.pages = [\"index.md\",\n         \"1_FixedPoints.md\",\n         \"2_Algorithms.md\",\n         \"3_UsingAdvice.md\",\n         \"4_Applications.md\",\n         \"5_TerminationConditions.md\",\n         \"99_refs.md\"]\nDepth = 2"
},

{
    "location": "1_FixedPoints/#",
    "page": "1 Fixed point acceleration",
    "title": "1 Fixed point acceleration",
    "category": "page",
    "text": ""
},

{
    "location": "1_FixedPoints/#Fixed-point-acceleration-1",
    "page": "1 Fixed point acceleration",
    "title": "1 Fixed point acceleration",
    "category": "section",
    "text": "A fixed point problem is one where we look for a vector, hatX in Re^N, so that for a given function f Re^N rightarrow Re^N we have:f(hatX) = hatXIf f Re^1 rightarrow Re^1 and thus any solution hatX will be a scalar then one way to solve this problem would be to use a rootfinder on the function g(x) = f(x) - x or to use an optimiser to minimise h(x) = (f(x) - x)^2. These techniques will not generally work however if f  N^a rightarrow N^a where a is large. Consider for instance using a multidimensional Newtonian optimiser to minimise h(x) = (f(x) - x)^2. The estimation of gradients for each individual dimension may take an infeasibly long time. In addition this method may not make use all available information. Consider for instance that we know that the solution for x will be an increasing vector (so x_i  x_j for any entries of x  with i  j) but has many entries. This information can be preserved and used in the vector acceleration algorithms that we present but would be more difficult to exploit in a standard optimisation algorithm.FixedPointAcceleration.jl implements eight algorithms for finding fixed points. The first algorithm implemented in this package is the \"simple\" method which merely takes the output of a function and feeds it back into the function. For instance starting with a guess of x_0, the next guess will be x_1 = f(x_0). The guess after that will be x_2 = f(x_1) and so on. In some conditions f will be a contraction mapping and so the simple method will be guaranteed to converge to a unique fixed point (Stokey, Lucas & Prescott 1989). Even when this is the case however the simple method may only converge slowly which can be inconvenient. The other seven methods this package implements are designed to be faster than the simple method but may not be convergent for every problem."
},

{
    "location": "2_Algorithms/#",
    "page": "2 Acceleration algorithms",
    "title": "2 Acceleration algorithms",
    "category": "page",
    "text": ""
},

{
    "location": "2_Algorithms/#Acceleration-algorithms-1",
    "page": "2 Acceleration algorithms",
    "title": "2 Acceleration algorithms",
    "category": "section",
    "text": ""
},

{
    "location": "2_Algorithms/#.1-Newton-acceleration-1",
    "page": "2 Acceleration algorithms",
    "title": "2.1 Newton acceleration",
    "category": "section",
    "text": "Here we will define g(x) = f(x) - x. The general approach is to solve g(x) with a rootfinder. The x that provides this root will be a fixed point. Thus after two iterates we can approximate the fixed point with:x_i+1 = x_i - fracg(x_i)g^prime(x_i)FixedPointAcceleration.jl approximates the derivative g^prime(x_i) so that we use an estimated fixed point of:textNext Guess = x_i - fracg(x_i)  frac g(x_i) - g(x_i-1)x_i-x_i-1      The implementation of the Newton method in this package uses this formula to predict the fixed point given two previous iterates.[1] This method is designed for use with scalar functions.[1]: Only two rather than three are required because we can use x_i+1 = f(x_i) and x_i+2 = f(x_i+1)."
},

{
    "location": "2_Algorithms/#.2-Aitken-acceleration-1",
    "page": "2 Acceleration algorithms",
    "title": "2.2 Aitken acceleration",
    "category": "section",
    "text": "Consider that a sequence of scalars  x_i _i=0^infty that converges linearly to its fixed point of hatx. This implies that for a large i:frachatx - x_i+1hatx - x_i approx frachatx - x_i+2hatx - x_i+1For a concrete example consider that every iteration halves the distance between the current vector and the fixed point. In this case the left hand side will be one half which will equal the right hand side which will also be one half.This above expression can be simply rearranged to give a formula predicting the fixed point that is used as the subsequent iterate. This is:textNext Guess = x_i - frac  (x_i+1 - x_i)^2    x_i+2 - 2x_i+1 + x_iThe implementation of the Aitken method in FixedPointAcceleration.jl uses this formula to predict the fixed point given two previous iterates. This method is designed for use with scalar functions. If it is used with higher dimensional functions that take and return vectors then it will be used elementwise."
},

{
    "location": "2_Algorithms/#.3-Epsilon-algorithms-1",
    "page": "2 Acceleration algorithms",
    "title": "2.3 Epsilon algorithms",
    "category": "section",
    "text": "The epsilon algorithms introduced by Wynn (1962) provides an alternate method to extrapolate to a fixed point. This documentation will present a brief numerical example and refer readers to Wynn (1962) or  Smith, Ford & Sidi (1987) for a mathematical explanation of why it works. The basic epsilon algorithm starts with a column of iterates (column B in the below figure). If i iterates have been performed then this column will have a length of i+1 (the initial starting guess and the results of the i iterations). Then a series of columns are generated by means of the below equation:epsilon_c+1^r = epsilon_c-1^r+1 + (epsilon_c^r+1 - epsilon_c^r)^-1Where c is a column index and r is a row index. The algorithm starts with the epsilon_0 column being all zeros and epsilon_1 being the column of the sequence iterates. The value in the furthest right column ends up being the extrapolated value.This can be seen in the below table which uses an epsilon method to find the fixed point of cos(x) with an initial guess of a fixed point of 1.(Image: The Epsilon Algorithm applied to the cos(x) function)In this figure B1 is the initial guess of the fixed point. Then we have the iterates B2 = cos(B1), B3 = cos(B2) and so on. Moving to the next column we have C1 = A2 + 1(B2-B1) and C2 = A3 + 1(B3-B2) and so on before finally we get F1 = D2 + 1(E2-E1). As this is the last entry in the triangle it is also the extrapolated value.Note that the values in columns C and E are poor extrapolations. Only the even columns D,F provide reasonable extrapolation values. For this reason an even number of iterates (an odd number of values including the starting guess) should be used for extrapolation. FixedPointAcceleration.jl\'s functions will enforce this by throwing away the first iterate provided if necessary to get an even number of iterates.In the vector case this algorithm can be visualised by considering each entry in the above table to contain a vector going into the page. In this case the complication emerges from the inverse - there is no clear interpretation of (epsilon_c^r+1 - epsilon_c^r)^-1 where (epsilon_c^r+1 - epsilon_c^r) represents a vector. The Scalar Epsilon Algorithm (SEA) uses elementwise inverses to solve this problem which ignores the vectorised nature of the function. The Vector Epsilon Algorithm (VEA) uses the Samuelson inverse of each vector (epsilon_c^r+1 - epsilon_c^r)."
},

{
    "location": "2_Algorithms/#.4-Minimal-polynomial-algorithms-1",
    "page": "2 Acceleration algorithms",
    "title": "2.4 Minimal polynomial algorithms",
    "category": "section",
    "text": "FixedPointAcceleration.jl implements two minimal polynomial algorithms, Minimal Polynomial Extrapolation (MPE) and Reduced Rank Extrapolation (RRE). This section will simply present the main equations but an interested reader is directed to Cabay & Jackson (1976) or Smith, Ford & Sidi (1987) for a detailed explanation.To first define notation, each vector (the initial guess and subsequent iterates) is defined by x_0 x_1  . The first differences are denoted u_j = x_j+1 - x_j and the second differences are denoted v_j = u_j+1 - u_j. If we have already completed k-1 iterations (and so we have k terms) then we will use matrices of first and second differences with U =  u_0  u_1    u_k-1  and V =  v_0  v_1   v_k-1 .For the MPE method the extrapolated vector, s, is found by:s = frac sum^k_ j=0   c_j x_j  sum^k_j=0 c_j Where the coefficient vector is found by c = -U^+ u_k where U^+  is the Moore-Penrose generalised inverse of the U matrix. In the case of the RRE the extrapolated vector, s, is found by:s = x_0 - U V^+ u_0"
},

{
    "location": "2_Algorithms/#.5-Anderson-acceleration-1",
    "page": "2 Acceleration algorithms",
    "title": "2.5 Anderson acceleration",
    "category": "section",
    "text": "Anderson (1965) acceleration is an acceleration algorithm that is well suited to functions of vectors. Similarly to the minimal polynomial algorithms it takes a weighted average of previous iterates. It is different however to these algorithms (and the VEA algorithm) in that previous iterates need not be sequential but any previous iterates can be used.Consider that we have previously run an N-dimensional function M times. We can define a matrix G_i = g_i-M  g_i-M+1   g_i where g(x_j) = f(x_j) - x_j. Each column of this matrix can be interpreted as giving the amount of ``movement\'\' that occurred in a run of the function.Now Anderson acceleration defines a weight to apply to each column of the matrix. This weight vector is M-dimensional and can be denoted mathbfalpha = alpha_0 alpha_1    alpha_M. These weights are determined by means of the following optimisation:min_mathbfalpha vertvert G_i mathbfalpha vertvert_2hspace1cm st sum^M_j=0 alpha_j = 1Thus we choose the weights that will be predicted to create the lowest ``movement\'\' in an iteration.With these weights we can then create the expression for the next iterate as:x_i+1 = sum_j=0^M alpha_j f(x_i-M+j)The actual implementation differs from the proceeding description by recasting the optimisation problem as an unconstrained least squares problem (see Fang & Saad 2009 or Walker & Ni 2011) but in practical terms is identical."
},

{
    "location": "3_UsingAdvice/#",
    "page": "3.  Using the FixedPointAcceleration package",
    "title": "3.  Using the FixedPointAcceleration package",
    "category": "page",
    "text": ""
},

{
    "location": "3_UsingAdvice/#.-Using-the-FixedPointAcceleration-package-1",
    "page": "3.  Using the FixedPointAcceleration package",
    "title": "3.  Using the FixedPointAcceleration package",
    "category": "section",
    "text": ""
},

{
    "location": "3_UsingAdvice/#.1-Basic-examples-of-using-FixedPointAcceleration-1",
    "page": "3.  Using the FixedPointAcceleration package",
    "title": "3.1 Basic examples of using FixedPointAcceleration",
    "category": "section",
    "text": ""
},

{
    "location": "3_UsingAdvice/#The-Babylonian-method-for-finding-square-roots.-1",
    "page": "3.  Using the FixedPointAcceleration package",
    "title": "The Babylonian method for finding square roots.",
    "category": "section",
    "text": "Now we will demonstrate how FixedPointAcceleration can be used for simple problems. For the simplest possible case consider we want to estimate a square root using the Babylonian method. To find the square root of a number x, given an initial guess t_0 the following sequence converges to the square root:t_n+1 = frac12 left t_n + fracxt_n rightThis is a fast converging and inexpensive sequence which probably makes an acceleration algorithm overkill but for sake of exposition we can implement this in FixedPointAcceleration. In the next code block we find the square root of 100 with the simple method:using FixedPointAcceleration\nSequenceFunction(x) = 0.5 .* (x .+ 100 ./ x)\nInitial_Guess = 6.0\nFP_Simple   = fixed_point(SequenceFunction, Initial_Guess; Algorithm = Simple)We can also solve for a vector of fixed points at the same time. For instance every square root from 1 to 100.NumbersVector = collect(1:100)\nSequenceFunction(x) = 0.5 .* (x .+ NumbersVector ./ x)\nInitial_Guess = repeat([10],100)\nFP_SEA   = fixed_point(SequenceFunction, Initial_Guess; Algorithm = RRE)Note that in this case the RRE method is being applied elementwise."
},

{
    "location": "3_UsingAdvice/#Vectorised-functions-1",
    "page": "3.  Using the FixedPointAcceleration package",
    "title": "Vectorised functions",
    "category": "section",
    "text": "The utility of the acceleration algorithms contained in FixedPoint are more apparent when applied to vectorised functions with cross dependency. For a simple example consider the below function where each entry of the vector depends on both entries of the previous iterate.SimpleVectorFunction(x) = [0.5*sqrt(abs(x[1] + x[2])), 1.5*x[1] + 0.5*x[2]]\nInitial_Guess =  [0.3,900]\nFP_Simple = fixed_point(SimpleVectorFunction  , Initial_Guess; Algorithm = Simple)\nFP_Anderson = fixed_point(SimpleVectorFunction, Initial_Guess; Algorithm = Anderson)This function takes 105 iterates to find a fixed point with the simple method but only 14 with the Anderson acceleration method."
},

{
    "location": "3_UsingAdvice/#.2-Easily-changing-algorithm-1",
    "page": "3.  Using the FixedPointAcceleration package",
    "title": "3.2 Easily changing algorithm",
    "category": "section",
    "text": "We can \"chain\" together different calls to the fixed_point function in order to switch acceleration algorithm at any point. For instance consider the following function and initial guess at a fixed point:func(x) = [0.5*sqrt(abs(x[1] + x[2])), 1.5*x[1] + 0.5*x[2]]\nInitial_Guess = [1.1,2.2]Now we can initially do two simple iterates. Then do three iterates with the MPE method. Then one with the simple method and then finish with the RRE method. This can be done in the following way:fp_chain      = fixed_point(func, Initial_Guess; Algorithm = Simple, MaxIter = 2)\nfp_chain      = fixed_point(func, fp_chain; Algorithm = MPE, MaxIter = 3)\nfp_chain      = fixed_point(func, fp_chain; Algorithm = Simple, MaxIter = 1)\nfp_chain      = fixed_point(func, fp_chain; Algorithm = RRE, MaxIter = 100)Now as it turns out The MPE (and RRE) does simple iterates except for every iterate that is a multiple of the ExtrapolationPeriod (7 by default). And so there is no difference from the above sequence of iterates and just doing all iterates with the RRE. This can be verified with the following:fp_nochain = fixed_point(func, Inputs; Algorithm = RRE, MaxIter = 100)\nfp_chain.Iterations_ == fp_nochain.Iterations_\nall(abs.(fp_chain.Inputs_ .- fp_nochain.Inputs_) .< 1e-14)This does highlight that there is no waste in changing fixed_point algorithm in this way. No iterates are reevaluated.Changing algorithms can be useful in some cases where an error occurs. For instance consider we are trying to find the fixed point of the following function:simple_vector_function(x) = [0.5*sqrt(x[1] + x[2]), 1.5*x[1] + 0.5*x[2]]\nInputs = [0.3,900]\nfp = fixed_point(simple_vector_function, Inputs; Algorithm = Anderson)Inspecting this fp object reveals an error after the 3rditeration because Anderson tries to use a negative value for both x entries which results in the square root of a negative number. We can switch to simple iterations to get closer to the fixed point at which point Anderson will no longer try negative numbers. This will fix this.fp = fixed_point(simple_vector_function, fp; Algorithm = Simple, MaxIter = 7)\nfp = fixed_point(simple_vector_function, fp; Algorithm = Anderson)"
},

{
    "location": "3_UsingAdvice/#.3-Graceful-error-handling-1",
    "page": "3.  Using the FixedPointAcceleration package",
    "title": "3.3 Graceful error handling",
    "category": "section",
    "text": "Hopefully FixedPointAcceleration is well tested enough that most kind of errors will be rare. FixedPointAcceleration also offers an option (ReplaceInvalids) to ensure that no acceleration algorithm generates guess vectors that contain NaNs, Missings or Infs. This option can be set to ReplaceVector  which will replace an extrapolated vector containingNaNs, Missings or Infs by the vector output in the previous iterate. If it is set to ReplaceElement then it will replace the individual elements that are missings, NANs or Infs by the corresponding elements in the output of the previous iterate.Errors are likely however in cases where inputs functions have a restricted domain. For example this may include functions that require the input vector to have a particular shape (ie concavity) or functions where the input vector must be strictly positive. For a simple example consider the vectorised function we introduced in section 3.1. Now rather thanx^prime1 = fracsqrtvert x1 + x2 vert2we havex^prime1 = fracsqrt x1 + x2 2where the output x has a prime and the inputs has no prime symbol. x^prime1 here is no longer real valued if the sum of the previous iterate is negative. This is what occurs in the 5th iterate of the Anderson method applied to this problem.The FixedPoint function handles these situations gracefully by saving all previous results as well as the proposed new vector that lead to the error. In the event of such an error the FailedEvaluation_ member of the returned FixedPointResults struct will describe the issue.This information is useful in order to diagnose the issue. In this case we might decide to modify the function to insert the absolute value function with the reasoning that the same fixed point will likely result (which we could later verify). This also allows a user to run one method until an error occurs and then switch methods. This is demonstrated below.SimpleVectorFunction(x) = [0.5*sqrt(x[1] + x[2]), 1.5*x[1] + 0.5*x[2]]\nInitial_Guess = [0.3,900]\nFPSolution = FixedPoint(SimpleVectorFunction, Initial_Guess; Algorithm = Anderson)# We can use this information to decide to switch to the simple method.\n# No error results as the simple method doesn\'t extrapolate.\nFPSolution = FixedPoint(SimpleVectorFunction, FPSolution; Algorithm = Simple, MaxIter = 5)\n# Now we switch to the Anderson Method again. No error results because we are\n# close to fixed point.\nFPSolution = FixedPoint(SimpleVectorFunction, FPSolution; Algorithm = Anderson)"
},

{
    "location": "3_UsingAdvice/#.4-Convergence-by-constant-increments-1",
    "page": "3.  Using the FixedPointAcceleration package",
    "title": "3.4 Convergence by constant increments",
    "category": "section",
    "text": "Most of the methods included in this function will fail in finding the fixed point of a function that converges by a fixed increment. For instance we may have a function that takes x and returns x shifted 1 unit (in Euclidian norm) in a straight line towards its fixed point. A realistic example of this is the training of a perceptron classifier which is explored later in section 4.3.This case is problematic for all methods except for the simple method. The basic problem can be illustrated simply by looking at the Newton method and the Aitken method. For the Newton method the derivative is approximated by frac g(x_i) - g(x_i-1)x_i-xi-1. When there is convergence by constant increments then g(x_i) = g(x_i-1)  and the derivative is zero which means calculating the Newton methods recommended new guess of the fixed point involves division by zero Now considering the Aitken method the new guess is given by x_i+1 = x_i - frac  (x_i+1 - x_i)^2    x_i+2 - 2x_i+1 + x_i. When there is convergence by constant increments then x_i - x_i+1 = x_i+1 - x_i+2  and so we have x_i+2 - 2x_i+1 + x_i = (x_i - x_i+1) - (x_i+1 - x_i+2) = 0. It is against not possible to calculate the new guess.[5]More generally similar problems exist for the other acceleration methods. When there is convergence by constant increments then then the fixed point method receives information about what direction to go in but no information about how far to go. This is a complication that is common to all of these acceleration methods in this package. In these cases it may be possible to change the function to make it converge by varying increments while retaining the same set of fixed points. This is shown in the perceptron example in section 4.2. In other cases where it is not possible to modify the function, it is advisable to use the simple method.[5]: When these complications arise the ReplaceInvalids method can be used to revert to a simple iterate or to change individual elements to the corresponding values in a simple iterate. This is as described in section 3.3."
},

{
    "location": "4_Applications/#",
    "page": "4.0 Applications",
    "title": "4.0 Applications",
    "category": "page",
    "text": ""
},

{
    "location": "4_Applications/#.0-Applications-1",
    "page": "4.0 Applications",
    "title": "4.0 Applications",
    "category": "section",
    "text": ""
},

{
    "location": "4_Applications/#.1-Finding-equilibrium-prices-in-a-pure-exchange-economy-1",
    "page": "4.0 Applications",
    "title": "4.1 Finding equilibrium prices in a pure exchange economy",
    "category": "section",
    "text": "Consider that there are N households in a pure exchange economy. Every household has preferences over G types of good. Household n has a utility function ofU_n = sum_i=1^G gamma_ni log(c_ni)Where gamma_ni is a parameter describing household n\'s taste for good i, c_ni is household n\'s consumption of good i. Each household is endowed with an amount of each good. They can then trade goods before consumption. We want to find the equilibrium prices in this exchange economy. We have data on each household\'s endowment and preferences for each good and want to determine the equilibrium prices for this pure exchange economy.We will choose good 1 as the numeraire. So P_1 = 1. First we will find an expression for demand given a price vector. Setting up the lagrangian for household n:L_n = sum_i=1^G gamma_ni log(c_ni) + lambda_n sum_i=1^G p_i(e_ni-c_ni) Where lambda_n is household n\'s shadow price and e_ni is this household\'s endowment of good i and p_i is the price of good i. Taking FOC with respect to c_i of this lagrangian yields:c_ni = fracgamma_nip_i lambda_nand taking FOC condition with respect to lambda_n yields the budget constraint. Subbing the above equation into the budget constrain and rearranging yields:lambda_n = fracsum^G_i=1 gamma_nisum^G_i=1 p_i e_niWe can also sum over households to find total demand for each good as:D_i = frac1P_i sum_n=1^G fracgamma_nilambda_nWe will find the equilibrium price vector by using an approximate price vector to find the lambdas. We can then find an estimate of the equilibrium price P_i which solves D_i = sum_n=1^G e_ni:P_i = fracsum_n=1^G e_nisum_n=1^G fracgamma_nilambda_n We use this approach in the code below for the case of 10 goods with 8 households. For exposition sake we generate some data below before proceeding to find the equilibrium price vector.# Generating data\nusing Distributions\nusing FixedPointAcceleration\nusing Random\nRandom.seed!(1234)\nN = 5\nG = 10\nEndowments = rand(LogNormal(), G, N)\nTastes      = rand(G, N)  \n# Every column here represents a household and every row is a good. So Endowments[1,2] is\n# the second household\'s endowment of good 1.\n\n# We now start solving for equilibrium prices:\nTotalEndowmentsPerGood = mapslices(sum, Endowments; dims = [2])\nTotalTastesPerHousehold = mapslices(sum, Tastes; dims = [1])\n\nfunction LambdasGivenPriceVector(prices)\n    ValueOfEndowmentsPerHousehold = prices .* Endowments\n    TotalValueOfEndowmentsPerHousehold =  mapslices(sum, ValueOfEndowmentsPerHousehold; dims = [1])\n    return TotalTastesPerHousehold ./ TotalValueOfEndowmentsPerHousehold\nend\n\nfunction IterateOnce(prices)\n    Lambdas = LambdasGivenPriceVector(prices)\n    TastesOverLambdas = Tastes ./ Lambdas\n    SumTastesOverLambdas = mapslices(sum, TastesOverLambdas; dims = [2])\n    NewPrices = SumTastesOverLambdas ./ TotalEndowmentsPerGood\n    NewPrices = NewPrices/NewPrices[1] # Applying Numeraire\n    return NewPrices\nend\n\n\nInitialGuess = repeat([1.0], 10)\nFPSolution = fixed_point(IterateOnce, InitialGuess; Algorithm = VEA)"
},

{
    "location": "4_Applications/#.2-The-Perceptron-Classifier-1",
    "page": "4.0 Applications",
    "title": "4.2 The Perceptron Classifier",
    "category": "section",
    "text": "The perceptron is one of the oldest and simplest machine learning algorithms (Rosenblatt 1958). In its simplest form, for each observation it is applied it uses an N-dimensional vector of features x together with N+1 weights w to classify the observation as being in category one or category zero. It classifies observation j as a type one if w_0 + sum_i=1^N w_i x_ij   0 and as a type zero otherwise.The innovation of the perceptron was its method for training its weights, w. This is done by looping over a set of observations that can be used for training (the \"training set\") and for which the true category information is available. The perceptron classifies each observation. When it correctly classifies an observation no action is taken. On the other hand when the perceptron makes an error then it updates its weights with the following expressions.w_0^prime = w_0 + ( d_j - y_j )w_i^prime = w_i + ( d_j - y_j ) x_ji hspace1cm text for  i geq 0Where w_i is the old weight for the i\'th feature and w_i^prime is the updated weight. x_ji is the feature value for observation j\'s feature i, d_j is the category label for observation j and y_j is the perceptron\'s prediction for this observation’s category.This training algorithm can be rewritten as fixed point problem. We can write a function that takes perceptron weights, loops over the data updating these weights and then returns the updated weight vector. If the perceptron classifies every observation correctly then the weights will not update and we are at a fixed point.[7]Most acceleration algorithms perform poorly in accelerating the convergence of this perceptron training algorithm. This is due to the perceptron often converging by a ﬁxed increment. This occurs because multiple iterates can result in the same observations being misclassiﬁed and hence the same changeintheweights. Asaresultwewillusethesimplemethodwhichisguaranteedtobeconvergent for this problem (Novikoff, 1963).First we generate a dataset:# Generating linearly separable data\nusing Distributions\nusing FixedPointAcceleration\nusing Random\nusing DataFrames\nnobs = 20\nRandom.seed!(1234)\ndata1 = DataFrame([rand(Normal(3,2), nobs), rand(Normal(8,2), nobs), repeat([-1.0],nobs)], [:x1, :x2, :y])\ndata2 = DataFrame([rand(Normal(-4,2), nobs), rand(Normal(10,12), nobs), repeat([1.0],nobs)], [:x1, :x2, :y])\ndata  = vcat(data1,data2)\n# Plotting it\nusing Plots\nplot(data1.x1, data1.x2,seriestype=:scatter)\nplot!(data2.x1, data2.x2,seriestype=:scatter)Now we write a function that will take a set of weights, update them and return the updated weights.function IteratePerceptronWeights(w, LearningRate = 1)\n    for i in 1:length(data[:y])\n        target = data[i,:y]\n        score = w[1] + (w[2]*data[i,:x1]) + (w[3]*data[i,:x2])\n        ypred = 2*((score > 0)-0.5)\n        if abs(target-ypred) > 1e-10\n            update = LearningRate * 0.5*(target-ypred)\n            w[1] = w[1] + update\n            w[2] = w[2] + update*data[i,:x1]\n            w[3] = w[3] + update*data[i,:x2]\n        end\n    end\n    return(w)\nend\nInitialGuess = [1.0, -2.0, 0.5]\nFP = fixed_point(IteratePerceptronWeights, InitialGuess; Algorithm = Simple, PrintReports = true)Only the simple method is convergent here and it is relatively slow taking 1121 iterations. We can still get a beneﬁt from accelerators however if we can modify the training algorithm to give training increments that change depending on distance from the ﬁxed point. This can be done by updating the weights by an amount proportional to a concave function of the norm of w_0 + sum_i=1^N w_i x_ij. Note that the instances in which the weights are not updated stay the same and hence the modiﬁed training function will result in the same set of ﬁxed points as the basic function. This is done in the next piece of code where the MPE method is used. It can be seen that there is a substantial increase in speed with only 54 iterations required by the MPE method.function IteratePerceptronWeights(w, LearningRate = 1)\n    for i in 1:length(data[:y])\n        target = data[i,:y]\n        score = w[1] + (w[2]*data[i,:x1]) + (w[3]*data[i,:x2])\n        ypred = 2*((score > 0)-0.5)\n        if abs(target-ypred) > 1e-10\n            update = LearningRate * -sign(score) * sqrt(abs(score))\n            w[1] = w[1] + update\n            w[2] = w[2] + update*data[i,:x1]\n            w[3] = w[3] + update*data[i,:x2]\n        end\n    end\n    return(w)\nend\nInitialGuess = [1.0, -2.0, 0.5]\nFP = fixed_point(IteratePerceptronWeights, InitialGuess; Algorithm = MPE, PrintReports = true)We can verify that the set of weights represented by the fixed_point function does correctly seperate the data by plotting it:# Plotting new seperation line\nx1 = -6.0:0.1:6.0\nw = FP.FixedPoint_\nx2_on_sep_line = (-w[1] .- w[2] .* x1) ./ w[3]\nplot!(x1,x2_on_sep_line, label =\"SeperationLine\")[7]: Note that for perceptrons there are always uncountably many such fixed points where the perceptron correctly classifies the entire training set and will not further update. On the other hand it is possible that the data is not linearly separable in which case there may be no fixed point and the weights will continue to update forever."
},

{
    "location": "4_Applications/#.3-Expectation-Maximisation-1",
    "page": "4.0 Applications",
    "title": "4.3 Expectation Maximisation",
    "category": "section",
    "text": "Consider we have a set of data which has come from two different multivariate normal distributions. There is a probability tau that a datapoint comes from the first multivariate distribution.# Generating data from two two-dimensional gaussian processes\nusing Distributions\nusing FixedPointAcceleration\nusing Random\nusing DataFrames\ntrue_tau = 0.6\nnobs_1 = 400\nnobs_2 = convert(Int, round(nobs_1 * ((1-true_tau)/true_tau)))\nRandom.seed!(1234)\nmu_1 = [0.0,8.0]\ncov_1 = [2.0,0.5,2.0]\ncovar_1 = Symmetric([cov_1[1] cov_1[2]; cov_1[2] cov_1[3]])\nmd_1 = MultivariateNormal(mu_1,covar_1)\nmu_2 = [-4.0,10.0]\ncov_2 = [2.0,-0.75,12.0]\ncovar_2 = Symmetric([cov_2[1] cov_2[2]; cov_2[2] cov_2[3]])\nmd_2 = MultivariateNormal(mu_2,covar_2)\n\nrands_from_1 = transpose(rand(md_1, nobs_1))\nrands_from_2 = transpose(rand(md_2, nobs_2))\ndata1 = DataFrame([rands_from_1[:,1], rands_from_1[:,2]], [:x1, :x2])\ndata2 = DataFrame([rands_from_2[:,1], rands_from_2[:,2]], [:x1, :x2])\ndd  = vcat(data1,data2)\n# Plotting it:\nplot(data1.x1, data1.x2,seriestype=:scatter)\nplot!(data2.x1, data2.x2,seriestype=:scatter)Now we want to estimate the parameter tau, the means (represented above by mu_1 and mu_2) and the covariance matrices (represented above by cov_1, cov_2) using only the realised datapoints in the DataFrame called dd. We will refer to these parameters as theta.If we knew from which distribution each datapoint came, the above task would be considerably easier. We could separate the data and for each use standard techniques to find the expected mean and covariance matrix. We do not know from which distribution each datapoint came from however. We could use a guess for theta to estimate the probabilities of each datapoint coming from each distribution however (and call this vector of estimates by Z). Then we could choose maximum likelihood estimates of theta using our estimates of Z in the likelihood expression. This is the EM approach. Note that it lends itself well to fixed point acceleration - We can write a function that given theta creates estimated probabilities of source distribution for each datapoint (Z) and uses these in a maximum likelihood expression to improve the estimate of theta.In this multivariate gaussian case there are simple expressions to choose parameters to maximise the likelihood. These are recounted on the wikipedia article on expectation maximisation and are used below:function z_estimate_given_theta(x::Array{Float64,1}, md_1::MultivariateNormal, md_2::MultivariateNormal, tau::Float64)\n    pdf_1 = pdf(md_1, x)\n    pdf_2 = pdf(md_2, x)\n    return tau*pdf_1 / (tau*pdf_1 + (1-tau)*pdf_2)\nend\n\nfunction update_tau(Z::Array{Float64,1})\n    return mean(Z)\nend\n\nfunction update_mu(dd::DataFrame, Z::Array{Float64,1})\n    X = convert(Array{Float64,2}, dd[[:x1, :x2]])\n    sum_Z = sum(Z)\n    updated_mu = (transpose(Z) * X) ./sum_Z\n    return vec(updated_mu)\nend\n\nfunction update_cov(dd::DataFrame, updated_mu::Array{Float64,1}, Z::Array{Float64,1})\n    X_minus_mu = convert(Array{Float64,2}, dd[[:x1, :x2]]) .- transpose(updated_mu)\n    sum_Z = sum(Z)\n    updated_cov = (transpose(Z .* X_minus_mu) * X_minus_mu) ./sum_Z\n    return [updated_cov[1,1], updated_cov[1,2], updated_cov[2,2]]\nend\n\nfunction update_theta(theta::Array{Float64,1}, dd::DataFrame)\n    # We will use the convention that theta\'s 11 entries are (mu_1, cov_1, mu_2, cov_2, tau). First unpacking theta:\n    mu_1    = theta[[1,2]]\n    cov_1   = theta[[3,4,5]]\n    covar_1 = Symmetric([cov_1[1] cov_1[2]; cov_1[2] cov_1[3]])\n    md_1 = MultivariateNormal(mu_1,covar_1)\n    mu_2    = theta[[6,7]]\n    cov_2   = theta[[8,9,10]]\n    covar_2 = Symmetric([cov_2[1] cov_2[2]; cov_2[2] cov_2[3]])\n    md_2 = MultivariateNormal(mu_2,covar_2)\n    tau     = theta[11]\n    # Getting Z\n    Z = Array{Float64,1}(undef,size(dd)[1])\n    for i in 1:size(dd)[1]\n        Z[i] = z_estimate_given_theta([dd[i,:x1], dd[i,:x2]], md_1, md_2, tau)\n    end\n\n    # Updating Tau\n    updated_tau = update_tau(Z)\n    # Updating mu1\n    updated_mu_1 = update_mu(dd,Z)\n    updated_mu_2 = update_mu(dd, 1 .- Z)\n    # Updating Cov\n    updated_cov_1 = update_cov(dd, updated_mu_1, Z)\n    updated_cov_2 = update_cov(dd, updated_mu_2, 1 .- Z)\n    # Returning theta\n    updated_theta = vcat(updated_mu_1, updated_cov_1, updated_mu_2, updated_cov_2, updated_tau)\n    return updated_theta\nendNow we can come up with a choice for an initial guess based on eyeballing the plotted data. We can then put it into the fixed_point function to get ML estimates of these distributional parameters as well as tau:InitialGuess = [0.5, 7.5, 2.0, 0.0, 2.0, -5.0, 7.5, 2.0, 0.0, 10.0, 0.5]\nfp_anderson = fixed_point(x -> update_theta(x,dd), InitialGuess; Algorithm = Anderson, PrintReports = true)\nfp_simple   = fixed_point(x -> update_theta(x,dd), InitialGuess; Algorithm = Simple, PrintReports = true)We can see that the Anderson method only takes 15 iterations while the simple method takes 80. By checking the generated fixedpoint against the data generation process it can also be verified that the fixedpoint we find provides quite good estimates."
},

{
    "location": "4_Applications/#.4-A-consumption-smoothing-problem-1",
    "page": "4.0 Applications",
    "title": "4.4 A consumption smoothing problem",
    "category": "section",
    "text": "Consider an infinitely lived consumer that has a budget of B_t at time t and a periodic income of 1. She has a periodic utility function given by epsilon_t x_t^delta, where x_t is spending in period t and epsilon_t is the shock in period t drawn from some stationary nonnegative shock process with pdf f(epsilon) defined on the interval yz. The problem for the consumer in period t is to maximise their value function:V(B_t  epsilon_t) =  max_0  x_t  B_t hspace05cm epsilon_t x_t^delta + beta int_y^z V(B_t+1  epsilon) f(epsilon)depsilonWhere beta is a discounting factor and B_t+1 = 1 + B_t - x_t.Our goal is that we want to find a function that gives the optimal spending amount, hatx(B_t epsilon_t),  in period t which is a function of the shock magnitude epsilon_t and the saved budgets B_t in this period. If we knew the function int_y^z V(B_t+1 vert epsilon) f(epsilon)depsilon then we could do this by remembering B_t+1 = 1 + B_t - x_t and using the optimisation:hatx(B_t epsilon_t) = textargmax_0  x_t  B_t hspace05cm epsilon_t x_t^delta + beta int_y^z V(B_t+1  epsilon) f(epsilon)depsilonSo now we need to find the function E_t V(B_t+1). Note as the shock process is stationary, the consumer lives forever and income is always 1, E_t V(B_t+1) will not vary with t. As a result we will rewrite it as simply f(b).Now we will construct a vector containing a grid of budget values, barb, for instance barb = 0 001002   5 (we will use bars to describe approximations gained from this grid). If we could then approximate a vector of the corresponding function values, barf,  so we had for instance barf = f(0) f(001) f(002)   f(5) then we could approximate the function by constructing a spline barf(b) between these points. Then we can get the function:barx(B_t epsilon_t) = textargmax_0  x  B_t hspace05cm epsilon_t x_t^delta + barf(B_t - x)So this problem reduces to finding the vector of function values at a discrete number of points, barf. This can be done as a fixed point problem. We can first note that this problem is a contraction mapping problem. In this particular example this means that if we define a sequence barf_0 = f_0 where f_0 is some initial guess and f_i = g(f_i-1) where g is given by the IterateOnce function below then this sequence will be convergent. Convergence would be slow however so below we will actually use the Anderson method:using Distributions\nusing FixedPointAcceleration\nusing HCubature\nusing Optim\nusing Random\nusing SchumakerSpline\ndelta = 0.2\nbeta = 0.95\nperiodic_income = 1.0\nshock_var = 1.0\nshock_process = LogNormal(0.0, shock_var)\nBudgetStateSpace = vcat( collect(0:0.015:periodic_income), collect(1.05:0.05:(3*periodic_income)))\nInitialGuess = sqrt.(BudgetStateSpace)\n\nfunction ValueGivenShock(Budget::Float64, epsilon::Float64, NextValueFunction::Schumaker)\n    opt = optimize(x ->  -1.0*(epsilon*(x^delta) + beta*evaluate(NextValueFunction, Budget - x + periodic_income)), 0.0, Budget)\n    return -1.0 * opt.minimum\nend\n\nfunction ExpectedUtility(Budget::Float64, NextValueFunction::Schumaker)\n    if Budget > 0.00001\n        integ = hcubature(epsilon-> ValueGivenShock(Budget, epsilon[1], NextValueFunction)* pdf(shock_process, epsilon[1]), [quantile(shock_process,0.0001)], [quantile(shock_process, 0.9999)])\n        return integ[1]\n    else\n        return beta * evaluate(NextValueFunction, periodic_income)\n    end\nend\n\nfunction OneIterateBudgetValues(BudgetValues::Array{Float64,1})\n    NextValueFunction = Schumaker(BudgetStateSpace, BudgetValues)\n    new_budget_values = zeros(length(BudgetStateSpace))\n    for i in 1:length(BudgetStateSpace)\n        new_budget_values[i] = ExpectedUtility(BudgetStateSpace[i], NextValueFunction)\n    end\n    return new_budget_values\nend\n\nfp_anderson = fixed_point(OneIterateBudgetValues, InitialGuess; Algorithm = Anderson, PrintReports = true)\nfp_simple   = fixed_point(OneIterateBudgetValues, InitialGuess; Algorithm = Simple, PrintReports = true)This takes 22 iterates with the Anderson algorithm which is drastically better than the 459 iterates it takes with the simple method."
},

{
    "location": "5_TerminationConditions/#",
    "page": "-",
    "title": "-",
    "category": "page",
    "text": ""
},

{
    "location": "5_TerminationConditions/#.0-Termination-conditions-and-Error-handling.-1",
    "page": "-",
    "title": "5.0 Termination conditions and Error handling.",
    "category": "section",
    "text": "There are three possible TerminationCondition_ types that can be returned in the FixedPointResults struct. These are:ReachedConvergenceThreshold - A fixed point has been reached.\nReachedMaxIter - The maximum number of iterations has been reached.\nInvalidInputOrOutputOfIteration - A fatal error has occured while trying to solve for a fixed point. This is often simple to fix by simply changing algorithms for a while and hence any errors are caught and a FixedPointResults struct is returned detailing the error rather than explicitly throwing an error.There are a few errors that can result in a InvalidInputOrOutputOfIteration termination. To aid in debugging where this termination condition is returned a FunctionEvaluationResult struct is returned as part of the FixedPointResults struct. This includes the inputs used when the error occured, the outputs (if they could be generated) and an additional error code (of enum type FP_FunctionEvaluationError):NoError - This indicates no error. You should never see this unless developing in the package as a function evaluation without an error will not cause a InvalidInputOrOutputOfIteration termination that causes the FunctionEvaluationResult struct to be returned.\nErrorExecutingFunction - This indicates that there was an error evaluating the function with the given inputs. This will occur for instance if you try to evaluate sqrt.(x) at x = [-1.0] or 1/x at x = [0.0]. This may be solved by changing acceleration algorithm so that it does not try a vector which causes errors in the function. It may also be possible to reparameterise the function so that any vector is a valid input to the function.\nLengthOfOutputNotSameAsInput - A function taking an N-dimensional vector is not returning an N-dimensional vector.\nInputMissingsDetected - A function is returning an input vector containing missing values.\nInputNAsDetected - A function is returning an input vector containing NaN values.\nInputInfsDetected - A function is returning an input vector containing Inf values. While mathematically there is nothing wrong with this (Inf is a fixedpoint of the f(x) = x!), the algorithms of this package are not going to be useful in this case and hence it is not supported.\nOutputMissingsDetected - A function is returning an output vector containing missing values.\nOutputNAsDetected - A function is returning an output vector containing NaN values.\nOutputInfsDetected - A function is returning an output vector containing Inf values. While mathematically there is nothing wrong with this (like for InputInfsDetected) it is not supported.Together this error handling system should handle any errors gracefully without raising an ErrorException. ErrorExceptions are avoided so that the Inputs and Outputs from previous iterates are retained and the search for a fixed point can be resumed without interruption. If an ErrorException does occur while using fixed_point please raise an issue in github because this is not expected."
},

{
    "location": "99_refs/#",
    "page": "References",
    "title": "References",
    "category": "page",
    "text": ""
},

{
    "location": "99_refs/#References-1",
    "page": "References",
    "title": "References",
    "category": "section",
    "text": "Anderson, D.G. 1965. \"Iterative Procedures for Nonlinear Integral Equations.\" Journal of the ACM 12 (4): 547–60.Cabay, S., and L.W. Jackson. 1976. \"A Polynomial Extrapolation Method for Finding Limits and Antilimits of Vector Sequences.\" Siam Journal of Numerical Analysis 13 (5): 734–52.Fang, Haw-ren, and Yousef Saad. 2009. \"Two Classes of Multisecant Methods for Nonlinear Acceleration.\" Numerical Linear Algebra with Applications 16 (3): 197–221.Novikoff. A. 1963. \"On convergence proofs for perceptrons.\" Stanford Research Institute: Technical Report, 298258.Rosenblatt, F. 1958. \"The perceptron: A probabilistic model for information storage and organization in the brain.\" Psychological Review, 65(6): 386–408.Smith, David, William Ford, and Avram Sidi. 1987. \"Extrapolation Methods for Vector Sequences.\" SIAM Review 29 (2): 199–233.Stokey, Nancy, Robert E. Lucas, and Edward Prescott. 1989. Recursive Methods in Economic Dynamics. Harvard University Press.Walker, Homer. 2010. \"Anderson Acceleration: Algorithms and Implementations.\".Walker, Homer, and Peng Ni. 2011. \"Anderson Acceleration for Fixed-Point Iterations.\" SIAM Review 49(4): 1715–35.Wynn, P. 1962. \"Acceleration Techniques for Iterated Vector and Matrix Problems.\" Mathematics of Computation 16 (79): 301–22."
},

]}
