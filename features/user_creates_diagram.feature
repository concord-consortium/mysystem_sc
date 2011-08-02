Feature: A User creates a diagram

  As a user
  I want to create a diagram
  So that I can show the energy flow of a system

  Background:
    Given I visit the application

  Scenario: User creates a diagram and links nodes
    When I drag the following onto the canvas:
      | type       | x   | y   |
      | clay       | 300 | 200 |
      | light bulb | 150 | 200 |
      | hand       | 450 | 200 |
    Then the canvas should have 3 nodes
    When I create the following links:
      | source_node | source_terminal | dest_node | dest_terminal |
      | 1           | a               | 2         | b             |
      | 1           | a               | 3         | b             |
    Then the canvas should have 2 links
    And the following nodes should be linked:
      | source_node | dest_node |
      | 1           | 2         |
      | 1           | 3         |

