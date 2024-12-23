import React, { useState, useEffect } from 'react'
import { Doughnut, Line } from 'react-chartjs-2'

import CTA from 'example/components/CTA'
import InfoCard from 'example/components/Cards/InfoCard'
import ChartCard from 'example/components/Chart/ChartCard'
import ChartLegend from 'example/components/Chart/ChartLegend'
import PageTitle from 'example/components/Typography/PageTitle'
import RoundIcon from 'example/components/RoundIcon'
import Layout from 'example/containers/Layout'
import response, { ITableData } from 'utils/demo/tableData'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon, TrashIcon, EditIcon } from 'icons'

import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button,
} from '@roketid/windmill-react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from 'utils/demo/chartsData'

import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useTaskStore } from 'hooks/task/task-store'

function Dashboard() {
  Chart.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const [page, setPage] = useState(1)
  const [data, setData] = useState<ITableData[]>([])

  // pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p: number) {
    setPage(p)
  }

  // Task store integration
  const { tasks, fetchTasks, updateTask, createTask, deleteTask } = useTaskStore();


  // Paginated data
  const [paginatedTasks, setPaginatedTasks] = useState([]);

  // Fetch tasks from the store on component mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Update paginated data whenever tasks or page changes
  useEffect(() => {
    const startIndex = (page - 1) * resultsPerPage;
    const endIndex = page * resultsPerPage;
    setPaginatedTasks(tasks.slice(startIndex, endIndex));
  }, [tasks, page]);


  // on page change, load new sliced data
  // here you would make another server request for new data
  // useEffect(() => {
  //   setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  // }, [page])

  return (
    <Layout>
      <PageTitle>Dashboard</PageTitle>
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Users" value="6389">
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>


        <InfoCard title="Total Task" value="376">
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Task Next 7 Dyas" value="376">
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total High Priority task" value="35">
          {/* @ts-ignore */}
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Updated By</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedTasks.sort((a: any, b: any) => a.id - b.id).map((task: any) => (
              <TableRow key={task.id}>
                <TableCell>
                  <span className="text-sm">{task.id}</span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.description}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">DL: {new Date(task.deadline).toLocaleString()}</p>
                    <div className='flex space-x-2 mt-2'>
                      <Badge className='text-xs'>{task.status}</Badge>
                      <Badge className='text-xs'>{task.priority}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(task.deadline).toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <Badge>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar
                      className="hidden mr-3 md:block"
                      src={task.assignedTo?.avatar || "https://randomuser.me/api/portraits/men/39.jpg"}
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{task.assignedTo?.username}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{task.assignedTo?.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.createdBy?.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.createdBy?.email}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(task.createdAt).toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold">{task.updatedBy?.username}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{task.updatedBy?.email}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(task.updatedAt).toLocaleString()}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChange}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </Layout>
  )
}

export default Dashboard