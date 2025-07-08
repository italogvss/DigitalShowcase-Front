import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import { Product } from '../../Model/ProductModel'
import { Template } from '../../Model/TemplateModel'
import { useFindAllProductsQuery } from '../../service/ProductService'
import { useAppSelector } from '../../store/hooks'
import { calcDisplay } from '../../Util/parseHTML'
import PriceTableDisplay from './PriceTableDisplay'


type Props = {
	settings: Template
	priceTableId: number | undefined
}

const TemplatePreView: React.FC<Props> = ({ settings, priceTableId }) => {
	const items = useAppSelector(state => state.product)
	const [displays, setDisplays] = useState<Product[][]>([])
	const user = useAppSelector(state => state.auth.user)
	useFindAllProductsQuery(user?.id?.toString() || '', { skip: items.length > 0 })
	useEffect(() => {
		async function getProducts() {
			if (priceTableId) {
				const filteredItems = items.filter(i => i.priceTableId === priceTableId);
				setDisplays(calcDisplay(filteredItems, settings.rows, settings.columns))
			}
		}
		getProducts()
	}, [priceTableId, items, settings.rows, settings.columns])


	return (
		<Box sx={{ display: 'flex', height: '100%', width: '100%', overflow: "hidden", alignItems: "center", justifyContent: 'center'}}
			borderRadius={3}
			padding={1}
		>
			{displays.length > 0 ?
				<Carousel sx={{ height: '100%', width: '100%' }}
					indicators={true}
					autoPlay={false}
					animation='slide'
					navButtonsAlwaysVisible={true}>
					{displays.map((list, index) => (
						<PriceTableDisplay
							key={`display-${index}`}
							template={settings}
							products={list}
							tableName='TESTE'
						/>
					))}

				</Carousel>
				:
				<Box sx={{ height: "80%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Typography>Tabela sem produtos, adicione produtos a esta tabela ou selecione outra para visualizar</Typography>
				</Box>
			}

		</Box>

	)
}

export default TemplatePreView
