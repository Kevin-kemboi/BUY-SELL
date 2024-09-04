import { getProductById } from '@/lib/api/api'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
    const {id} = useParams();
    const [product, setProduct] = useState()

    const fetchProduct = async()=>{
        const response = await getProductById(id);
        
        if(response.success){
            
            setProduct(response.product)
        }
    }


    useEffect(() => {
      fetchProduct();
    }, [])
    

  return (
    <>
    
    
    </>
  )
}

export default ProductDetails