import React from "react"
import { AnimatePresence } from "framer-motion"
import { SContainer, SHeader } from "./style"

const Evidence = (props) => {
  return (
    <AnimatePresence>
      {props.show ? (
        <SContainer
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, type: "tween", ease: "easeOut" }}
        >
          <SHeader>Evicence Snippet</SHeader>
          <pre>
            <code>
              ...example code block ksadlfkjas d skdalfj apsldkfja;sldkfj ;alkdj f;laskdjf ;laskdj flaksjdf kfj asl;kdf
              <span> 100 Pine Street, Middletown CT, 06457</span> laksj dflkasj dflkjas dlfk as; lsdkafj al;skdfj
              a;lskdfj ;lkasdfj l;aksdjf laksjd flaksjdf ;laksdfjla;skdjf a;sdkf ja;lsdkfj las;kfj alkd falskdfj alsdkf;
              alsdkf jaldkf lkfj asldkf...
            </code>
          </pre>
        </SContainer>
      ) : null}
    </AnimatePresence>
  )
}

export default Evidence
