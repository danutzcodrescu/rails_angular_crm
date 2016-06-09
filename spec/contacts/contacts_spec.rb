require '../rails_helper'

scenario "Our Contacts Route" do
    visit "/contacts"
    within "section h3" do
        expect(page).to have_content("Contacts")
    end
end