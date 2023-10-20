Feature: Retirement savings Calculator

  Background: User navigation to Retirement Savings Calculator page
    Given user navigates to Securian's Retiremnet Savings Calculator page

  Scenario Outline: Validate user submits the Form with all/only required fields
    When user enters data in "<defaultFields>" fields
    And user clicks on Calculate button
    Then user should see the success message with calculated result

    Examples:
      | defaultFields |
      | required      |
      | all           |

  Scenario Outline: Validate error message displays when user submits the Form without entering data in all the required fields
    When user enters data into all the required fields except in "<reqfieldNumber>" field
    And user clicks on Calculate button
    Then user should see an error message "Please fill out all required fields"
    And user should see incomplete field "<reqfieldNumber>" is highlighted with red color

    Examples:
      | reqfieldNumber |
      | 1              |
      | 2              |
      | 3              |
      | 4              |
      | 5              |
      | 6              |

Scenario: Validate additional Social Security fields display on SSN radio button toggle
  When user selects SSN radio button to "Yes" on the Page
  Then user should see the Social Security fields
  When user selects SSN radio button to "No" on the Page
  Then user should not see the social Security fields


Scenario: Validate user updates the default calculator values
  When user clicks the Adjust default value link
  Then user should update the data on default calculator popup 
  When user save the changes on default calculator popup
  Then user should be on retirement calculator page