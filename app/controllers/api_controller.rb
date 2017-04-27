class ApiController < ApplicationController
    def get
        render json: get_records(params[:table], params[:q])
    end
    def search
        render json: search_records(params[:table], params[:by], params[:q])
    end

    private
        def get_records(model_name, query)
            records = model_name.singularize.classify.constantize
            if query.downcase == 'all'
                return records.all
            else
                return records.find(Integer(query))
            end
        end
        def search_records(model_name, search_criteria, search_query)
            records = model_name.singularize.classify.constantize.all
            criteria = search_criteria.downcase
            query = search_query.downcase
            
            results = []
            hash_results = {}
            
            # Stage 1: Exact, starts_with? Match
            records.each do |entry|
                if entry[criteria].downcase.starts_with?(query)
                    results.push(entry)
                end
            end

            # Stage 2: AlphaNumeric Only, starts_with? Match
            records.each do |entry|
                if entry[criteria].downcase.gsub(/[^0-9a-z]/i, '').starts_with?(query.gsub(/[^0-9a-z]/i, ''))
                    results.push(entry) if results.include?(entry) == false
                end
            end

            # Stage 3: Exact, include? Match
            records.each do |entry|
                if entry[criteria].downcase.include?(query)
                    results.push(entry) if results.include?(entry) == false
                end
            end

            # Stage 4: AlphaNumeric Only, include? Match
            records.each do |entry|
                if entry[criteria].downcase.gsub(/[^0-9a-z]/i, '').include?(query.gsub(/[^0-9a-z]/i, ''))
                    results.push(entry) if results.include?(entry) == false
                end
            end

            # Convert to Hash
            hash_results['count'] = results.count
            hash_results['items'] = []
            for i in 0..(results.count - 1)
                hash_results['items'].push(results[i])
            end

            return hash_results
        end
end
