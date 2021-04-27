import React, { useEffect, useState } from "react"
import Scaffold from "../../components/scaffold"
import { SAddButton, SHeader, SListContent, SListHeader, STitle } from "./style"
import { SContainer, SSubtitle } from "./style"
import * as Icons from "../../../libs/icons"
import ListItem from "./components/list-item"
import EditModal from "./components/edit-modal"
import { WatchlistKeyval } from "../../../libs/indexed-db"
import { importData } from "../../../background/analysis/importSearchData"

const WatchlistView = () => {
  const [modalConfig, configModal] = useState({ open: false, edit: false })
  const [items, setItems] = useState([])
  const updateList = () => {
    WatchlistKeyval.values().then((values) => setItems(values));
    importData();
  }

  useEffect(() => updateList(), [])

  return (
    <React.Fragment>
      <EditModal
        keywordType={modalConfig.keywordType}
        keyword={modalConfig.keyword}
        id={modalConfig.id}
        edit={modalConfig.edit}
        showModal={modalConfig.open}
        configModal={configModal}
        updateList={updateList}
      />
      <Scaffold>
        <SContainer>
          <SHeader>
            <div>
              <STitle>Watchlist</STitle>
              <SSubtitle>
                Edit your watchlist so we can monitor personal information collected and shared between companies.
              </SSubtitle>
            </div>
            <div>
              <SAddButton onClick={() => configModal((config) => ({ open: !config.open }))}>
                <Icons.Plus size="24px" />
                Add Keyword
              </SAddButton>
            </div>
          </SHeader>
          <SListHeader>
            <div>KEYWORD</div>
            <div>TYPE</div>
          </SListHeader>
          <SListContent>
            {items.map((item) => (
              <ListItem
                key={item.id}
                id={item.id}
                type={item.type}
                keyword={item.keyword}
                configModal={configModal}
                updateList={updateList}
              />
            ))}
          </SListContent>
        </SContainer>
      </Scaffold>
    </React.Fragment>
  )
}

export default WatchlistView
