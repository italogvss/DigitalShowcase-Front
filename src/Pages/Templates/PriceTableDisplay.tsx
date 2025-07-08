import { Product } from "../../Model/ProductModel";
import { Template } from "../../Model/TemplateModel";


type Props = {
	template: Template
	products: Product[]
	tableName: string
}

const hexToRgba = (hex: string, alpha: number) => {
	const rgb = {
		r: parseInt(hex.slice(1, 3), 16),
		g: parseInt(hex.slice(3, 5), 16),
		b: parseInt(hex.slice(5, 7), 16),
	};
	return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

const PriceTableDisplay: React.FC<Props> = ({ template, products, tableName }) => {
	const grid = template.haveGrid ? template.grid : []
	const imageURL = template.image?.url
	const backgroundURL = template.background?.url

	return (

		<div
			style={{
				display: 'flex',
				aspectRatio: '16/9',
				backgroundColor: "black",
				position: 'relative' as 'relative',
				overflow: 'hidden',
				width: '100%',
				height: '100%',
				backgroundImage: template.haveBackground ? `url(${backgroundURL})` : "none",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundRepeat: 'no-repeat',
			}}
		>
			{template.haveImage && (
				<div
					style={{
						width: `${template.imageSize * 2}%`,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: template.color1,
						backgroundSize: 'cover',
						backgroundPosition: 'center',
						overflow: 'hidden',
					}}
				>
					<img
						src={imageURL}
						alt="Opss! :( não consegui carregar essa inmagem!"
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							objectPosition: `${template.imagePos * 2.5}%`,
						}}
					/>
				</div>
			)}
			<div
				style={{
					border: grid.some(s => s === 'outer') ? `1px solid ${template.gridColor}` : 'none',
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					containerType: 'size'
				}}
			>
				  {template.showName && (
					<div style={{
						color: template.textColor,
						fontSize: `${template.textSize * 0.6}vw`,
						textAlign: 'center',
						display: 'flex', // Usa flexbox
						alignItems: 'center', // Centraliza verticalmente
						height: '10%', // Altura fixa da div
						lineHeight: 'normal', // Ajusta a altura da linha
						justifyContent: 'center',
						backgroundColor: template.color1,
						fontWeight: 'bold',
						whiteSpace: 'nowrap',
						visibility: 'visible',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}>
						{tableName.toUpperCase() }
					</div>
				)} 
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
						gridAutoRows: `1fr`,
						width: '100%',
						height: '100%',
					}}
				>
					{Array.from({ length: template.columns }).map((_, colIndex) => (
						<div key={colIndex} id="Columns" style={{
							display: 'flex', flexDirection: 'column', height: '100%',
							borderLeft: (grid as string[]).some(s => s === 'vertical') ? `1px solid ${template.gridColor}` : 'none',
						}}>
							{Array.from({ length: template.rows }).map((_, rowIndex) => {
								const itemIndex = colIndex * template.rows + rowIndex;

								const backgroundColor = template.isStriped
									? rowIndex % 2 === 0
										? template.color1
										: template.color2
									: template.color1;
								const rgba = hexToRgba(backgroundColor, template.translucid / 100);
								return (
									<div
										key={rowIndex}
										id="linha"
										style={{
											flex: 1,
											display: 'flex',
											alignItems: 'center',
											textAlign: 'left',
											justifyContent: 'space-between',
											borderBottom: (grid as string[]).some(s => s === 'horizontal') ? `1px solid ${template.gridColor}` : 'none',
											backgroundColor: template.isTranslucid ? rgba : backgroundColor,
											fontWeight: 'bold',
											containerType: 'size'
										}}
									>
										<div id='celula-nome' style={{
											whiteSpace: 'nowrap',
											visibility: 'visible',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											paddingLeft: '2%',
											paddingRight: '2%',
											justifyContent: template.textPos,
											flex: '1 1 90%',
											color: template.textColor,
											/* fontSize: `${settings.fontSize * 5}cqh`, */
											fontSize: `${template.textSize * 0.5}vh`,
											display: 'flex'
										}}>
											{products[itemIndex] ? products[itemIndex].name.toUpperCase() : ' '}
										</div>
										<div id='celula-preco' style={{
											paddingRight: '2%',
											color: template.priceColor,
											flex: '1 1 10%',
											visibility: 'visible',
											whiteSpace: 'nowrap',
											/* fontSize: `${settings.fontSize * 5}cqh`, */
											fontSize: `${template.textSize * 0.5}vh`,
											height: '100%',
											display: 'flex',
											alignItems: 'center'
										}}>
											{products[itemIndex] ? `${template.cipher}${products[itemIndex].price.toFixed(2)}` : ' '}
										</div>
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>

		</div>
	)
}

export default PriceTableDisplay
