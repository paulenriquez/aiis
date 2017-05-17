class CustomerPayment < ApplicationRecord
    belongs_to :customer_account
    belongs_to :purchase_order

    def self.to_csv(options = {})
		CSV.generate(options) do |csv|
			csv << column_names
			all.each do |member|
				csv << member.attributes.values_at(*column_names)
			end
		end
	end
end
