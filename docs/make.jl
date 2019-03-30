using Documenter, FixedPointAcceleration

makedocs(
    format = Documenter.HTML(),
    sitename = "FixedPointAcceleration",
    modules = [FixedPointAcceleration],
    pages = ["index.md",
             "1_FixedPoints.md",
             "2_Algorithms.md",
             "3_UsingAdvice.md",
             "4___EquilibriumPriceVector.md",
             "4___Perceptron.md",
             "4___ExpectationMaximisation.md",
             "4___ConsumptionSmoothing.md",
             "4___ConfidenceHypercube.md",
             "5_TerminationConditions.md",
             "99_refs.md"]
)

deploydocs(
    repo   = "github.com/s-baumann/FixedPointAcceleration.jl.git",
    target = "build",
    deps   = nothing,
    make   = nothing
)
