import React from 'react'
import { assets } from '../../../../admin/src/assets/assets'

const Orders = () => {
    return (
        <form>
            <p>Orders</p>
            <div>
                <div>
                    <label htmlFor=''>
                        <img src={assets.chef_icon} alt="" />
                    </label>
                </div>
            </div>
        </form>
    )
}

export default Orders