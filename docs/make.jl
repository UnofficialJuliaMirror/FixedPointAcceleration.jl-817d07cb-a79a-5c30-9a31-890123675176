using Documenter, FixedPointAcceleration

makedocs(
    format = Documenter.HTML(),
    sitename = "FixedPointAcceleration",
    modules = [FixedPointAcceleration],
    pages = ["index.md",
             "2_Algorithms.md",
             "3_UsingAdvice",
             "99_refs.md"]
)

deploydocs(
    repo   = "github.com/s-baumann/FixedPointAcceleration.jl.git",
    target = "build",
    deps   = nothing,
    make   = nothing
)
