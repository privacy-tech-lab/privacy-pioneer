/* Create checkbox for what type of data should be exported */

import { SLabel } from "../../../../components/website-label-list/style";
import { SForm, SInput, SNavigationBar } from "../../../watchlist-view/components/edit-modal/style";

{/* <SForm>
    <SNavigationBar>

    </SNavigationBar>
    <input type='checkbox'>
        Remove ...
    </input>
</SForm> */}

const checkboxChecker = () => {
    const [checked, setChecked] = React.useState(false);
  
    const handleChange = () => {
      setChecked(!checked);
    }

/**
 * Form for a user to add their own non-location keywords
 */
 //const AnalyticsForm = ({}) => {
    return (
      <SKeyword>
        <SHeader>Remove</SHeader>
        <SLabel>
            <SInput
                type = "checkbox"
                checked={checked}
                onChange={handleChange}
                />
                Remove Adress
            
        </SLabel>
      </SKeyword>
    )
  }

  export {checkboxChecker}