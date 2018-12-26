struct FixedPointResults
    FixedPoint_::Union{Missing,Array{Float64,1}}
    Convergence_::Union{Missing,Float64}          #
    TerminationMessage_::Symbol
    Iterations_::Int
    ConvergenceVector_::Union{Missing,Array{Float64,1}}
    FailedEvaluation_::Union{Missing,NamedTuple}
    Inputs_::Array{Float64,2}
    Outputs_::Array{Float64,2}
    function FixedPointResults(Inputs_::Array{Float64,2}, Outputs_::Array{Float64,2}, TerminationMessage_::Symbol;
                               ConvergenceVector_::Union{Missing,Array{Float64,1}} = missing,
                               FailedEvaluation_::Union{Missing,NamedTuple} = missing)
        Iterations_ = size(Inputs_)[2]
        FixedPoint_ = missing
        Convergence_ = missing
        if !(isempty(Outputs_))
            FixedPoint_ = Outputs_[:,Iterations_]
        end
        if (!(ismissing(ConvergenceVector_))) && !(isempty(ConvergenceVector_))
            Convergence_ = ConvergenceVector_[Iterations_]
        end
        return new(FixedPoint_, Convergence_, TerminationMessage_, Iterations_, ConvergenceVector_, FailedEvaluation_, Inputs_, Outputs_)
    end
end

@enum FixedPointAccelerationAlgorithm begin
           Simple = 1
           Anderson = 2
           Newton = 3
           Aitken = 4
           MPE = 5
           RRE = 6
           SEA = 7
           VEA = 8
end
