Given /I visit the application/ do
  @test = new_test

  @canvas = @test['canvas']
  @palette = @test['palette']

  @add_bulb = @palette.childViews[2]
  @add_hand = @palette.childViews[1]
  @add_clay = @palette.childViews[0]
end
