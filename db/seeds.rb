# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
    i=1;
    category = ["Finance", "Energy", "Transport", "Environment"]
    
    100000.times do |contact|
        contact=Contact.create!(first_name: Faker::Name.first_name,
                                last_name: Faker::Name.last_name,
                                email: Faker::Internet.user_name + "#{i}" +"@" + Faker::Internet.domain_name,
                                organization: Faker::Company.name,
                                phone_number: Faker::PhoneNumber.phone_number,
                                main_category: category.sample
                                )
        i+=1                        
    end
    
    