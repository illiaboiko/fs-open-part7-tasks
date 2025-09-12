import axios from 'axios'
import { useEffect, useState } from 'react'

export const useResource = (baseUrl) => {
 
  const [resources, setResources] = useState([])

  useEffect(() => {
    console.log('initated useEffect function')
    axios.get(baseUrl).then((response) => {
        console.log('received response from get', response)
        setResources(response.data)
    })
  }, [])

  const create = async (dataObject) => {

    const response = await axios.post(baseUrl, dataObject )
    const newData = response.data
    setResources([...resources, newData])
  }

  const service = {
    create,
  }

  return [resources, service]
}
