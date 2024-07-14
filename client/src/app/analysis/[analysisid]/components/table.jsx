"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCustom } from "@table-library/react-table-library/table";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/chakra-ui";
import { useRowSelect } from "@table-library/react-table-library/select";
import {
  useTree,
  TreeExpandClickTypes,
} from "@table-library/react-table-library/tree";
import { useSort } from "@table-library/react-table-library/sort";
import { usePagination } from "@table-library/react-table-library/pagination";
import {
  fromTreeToList,
  findNodeById,
  insertNode,
} from "@table-library/react-table-library/common";
import {
  Text,
  Box,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Checkbox,
  IconButton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  FaPen,
  FaSearch,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
} from "react-icons/fa";

import { nodes } from "./data";

const key = "Showreel";

const Component = () => {
  const router = useRouter();
  const [data, setData] = React.useState({ nodes });


  useEffect(() => {
    async function getData(params) {
      const response = await fetch(`/api/analysis/${params}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);

      setData(result);
    }
    getData();
  }, []);

  //* Theme *//

  const chakraTheme = getTheme({
    ...DEFAULT_OPTIONS,
    striped: true,
  });
  const customTheme = {
    Table: `
      --data-table-library_grid-template-columns:  64px repeat(5, minmax(0, 1fr));

      margin: 16px 0px;
    `,
  };
  const theme = useTheme([chakraTheme, customTheme]);

  //* Resize *//

  const resize = { resizerHighlight: "#dee2e6" };

  //* Pagination *//

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 7,
    },
    onChange: onPaginationChange,
  });

  function onPaginationChange(action, state) {
    console.log(action, state);
  }

  //* Search *//

  const [search, setSearch] = React.useState("");

  useCustom("search", data, {
    state: { search },
    onChange: onSearchChange,
  });

  function onSearchChange(action, state) {
    console.log(action, state);
    pagination.fns.onSetPage(0);
  }

  //* Filter *//

  const [isHide, setHide] = React.useState(false);

  useCustom("filter", data, {
    state: { isHide },
    onChange: onFilterChange,
  });

  function onFilterChange(action, state) {
    console.log(action, state);
    pagination.fns.onSetPage(0);
  }

  //* Select *//

  const select = useRowSelect(data, {
    onChange: onSelectChange,
  });

  function onSelectChange( state,action) {
    console.log( state);
  }

  //* Tree *//

  //* Sort *//

  const sort = useSort(
    data,
    {
      onChange: onSortChange,
    },
    {
      sortIcon: {
        iconDefault: null,
        iconUp: <FaChevronUp />,
        iconDown: <FaChevronDown />,
      },
      sortFns: {
        TASK: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        DEADLINE: (array) => array.sort((a, b) => a.deadline - b.deadline),
        TYPE: (array) => array.sort((a, b) => a.type.localeCompare(b.type)),
        COMPLETE: (array) => array.sort((a, b) => a.isComplete - b.isComplete),
        TASKS: (array) =>
          array.sort((a, b) => (a.nodes || []).length - (b.nodes || []).length),
      },
    }
  );

  function onSortChange(action, state) {
    console.log(action, state);
  }

  //* Drawer *//

  //* Modal *//

  

  //* Custom Modifiers *//

  let modifiedNodes = data.nodes;

  // search
  modifiedNodes = modifiedNodes.filter((node) =>
    node.name.toLowerCase().includes(search.toLowerCase())
  );

  // filter
  modifiedNodes = isHide
    ? modifiedNodes.filter((node) => !node.isComplete)
    : modifiedNodes;

  //* Columns *//
  const handleRowClick = (name) => {
  console.log(name);
  };

  const COLUMNS = Object.keys(nodes[0]).map((key) => {
    
    let column = {
      label: key.toUpperCase(),
      renderCell: (item) => item[key],
      resize,
      sort: { sortKey: key.toUpperCase() },
    };

    if (key === "name") {
      column.select = {
        renderHeaderCellSelect: () => null,
        renderCellSelect: (item) => null,
      };
      column.tree = true;
    }

    if (key === "deadline") {
      column.renderCell = (item) =>
        item.deadline.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

  }
  if(key==="delete"){
    column.renderCell= (item) => (
      <button
  onClick={() => handleRowClick(item.name)}
  cursor="pointer"
  style={{ backgroundColor: 'red', color: 'white' }}
>
  Delete
</button>
    )
  }
    

    return column;
  });


  return (
    <>
     

      {/* Form */}

      <HStack m={3}>
        

        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch style={{ color: "#4a5568" }} />}
          />
          <Input
            placeholder="Search Task"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </InputGroup>
        <Checkbox
          style={{ whiteSpace: 'nowrap' }}
          colorScheme="teal"
          isChecked={isHide}
          onChange={(event) => setHide(event.target.checked)}
        >
          Hide Complete
        </Checkbox>
        
      </HStack>

      {/* Table */}

      <Box p={3} borderWidth="1px" borderRadius="lg">
        <CompactTable
          columns={COLUMNS}
          data={{ ...data, nodes: modifiedNodes }}
          theme={theme}
          layout={{ custom: true }}
          select={select}
          sort={sort}
          pagination={pagination}
        />
      </Box>

      <br />
      <HStack justify="flex-end">
        <IconButton
          aria-label="previous page"
          icon={<FaChevronLeft />}
          colorScheme="teal"
          variant="ghost"
          disabled={pagination.state.page === 0}
          onClick={() => pagination.fns.onSetPage(pagination.state.page - 1)}
        />

        {pagination.state.getPages(modifiedNodes).map((_, index) => (
          <Button
            key={index}
            colorScheme="teal"
            variant={pagination.state.page === index ? "solid" : "ghost"}
            onClick={() => pagination.fns.onSetPage(index)}
          >
            {index + 1}
          </Button>
        ))}
        <IconButton
          aria-label="next page"
          icon={<FaChevronRight />}
          colorScheme="teal"
          variant="ghost"
          disabled={
            pagination.state.page + 1 ===
            pagination.state.getTotalPages(data.nodes)
          }
          onClick={() => pagination.fns.onSetPage(pagination.state.page + 1)}
        />
      </HStack>
    </>
  );
};

export default Component;
