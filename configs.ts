export const sampleNegotiatedRateUrls = [
  {
    title: "Anthem",
    url: "https://anthembcca.mrf.bcbs.com/2024-09_690_08D0_in-network-rates_17_of_35.json.gz?&Expires=1729519239&Signature=RMX6FOUgTkOr-jfuhg9EeVNike1OADU-rGMMcyd8TjFlxZzdLlGDIdbpXISXrdvZIc4W95nRXU0D6zOinfMn~hwhf~-vaZI1TTYc2nAniFnz~mDnulESh-L~MHrTj3GPKyb~P0oRzcUOdH27IuIRdVLW7LC58bANxTq~lboz5p07mjmVglj3uCusLV-h4e2AyL2G-G~d27rVBGqYBUUd51UmoOClh9qtDJGvwIhuSXwoMkmIisDXW3zFvdUJFdT~WeAl9G7quP5zaxqBExhg0sxKmiF6Dua0GXggARP0dO18AM2LGILnvBKUSELHk4j5ojGYTJpRzPrmNgDnms0TGw__&Key-Pair-Id=K27TQMT39R1C8A",
    ein: "472407414",
    billing_code:
      "95782,95783,95908,95909,95910,95923,95938,95961,95803,95928,96020,95800,95813,95822,95861,95886,95919,95921,95926,95929,95816,95872",
  },
  {
    title: "Cigna Healthcare",
    url: "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/mrf/in-network-rates/reporting_month=2024-09/2024-09-01_cigna-health-life-insurance-company_central-florida-network-seamless_in-network-rates.json.gz?Expires=2045793599&Signature=LRUeDFii~U5J315RSElWvd1cpNS-5k9vyQzsZkDKFZDe3lOZhl46YP4D99SKs6jVnZvktt2GELyCnpaR3xQ~I3tWLwp8bvC~~r4KiZ~KcUsU6630gqbcMnLWU63p53CaAfivQtFtxkDkQ2ZkgDWT8KWkOLRffuBxnZTIQEjkM~hi3ocqX38UBYRcvIvUlNTShHW~aJz2oxXZOwBvS1qiTV0y9ypnDsHGYHgn4zE-RZ1KaJgiFwFzMfNYToWnoVBhpw10gUMLjEb81dlxD1z1GJTYIdw8j3WHfWIyOkljKjC~JEsOcncdjvD0Lnclk5Ron7kLXbNv85EcMAqX50Koww__&Key-Pair-Id=K1NVBEPVH9LWJP",
    npi: "1326093246",
  },
  {
    title: "United Health Care",
    url: "https://mrfstorageprod.blob.core.windows.net/public-mrf/2024-09-01/2024-09-01_United-HealthCare-Services--Inc-_Third-Party-Administrator_University-of-Missouri---St--Louis_GSP-942-C636_in-network-rates.json.gz?sp=r&st=2024-03-26T04:49:21Z&se=2025-03-25T12:49:21Z&spr=https&sv=2022-11-02&sr=c&sig=M0sm1qeV6LULQexjwJYsuupRKv1UpgsQLzpfLtZbzkk%3D",
    npi: "1407381569,1366997215,1437515202,1780795658,1497231013,1205235355,1982805354,1558532895,1417169855,1144625039,1588194427",
    ein: "431771217",
  },
];

export const sampleAllowedAmountUrls = [
  {
    title: "United Health Care",
    url: "https://mrfstorageprod.blob.core.windows.net/public-mrf/2024-09-01/2024-09-01_United-Healthcare-Insurance-Company_National-Ancillary-Network_allowed-amounts.json.gz?sp=r&st=2024-03-26T04:49:21Z&se=2025-03-25T12:49:21Z&spr=https&sv=2022-11-02&sr=c&sig=M0sm1qeV6LULQexjwJYsuupRKv1UpgsQLzpfLtZbzkk%3D",
  },
  {
    title: "Cigna",
    url: "https://d25kgz5rikkq4n.cloudfront.net/cost_transparency/mrf/allowed_amounts/reporting_month=2024-09/client_id=00059486/2024-09-01_cigna-health-life-insurance-company_national-oap_allowed-amounts.json.gz?Expires=2045793599&Signature=MhFyXeSk80d0cAfMHtiGv1OJ43xxpjhGmDtlD4WmAJpp2hTanIjc7w1HJGe0GyCziGFBUQviSPeJprYni27kNn1vZcM-tsu31MXRTgqV~nuZusFE0Qmn68iIqi6rFUgXFNqeAEzR-NIjqYmRuooAhWLNlR7MZlNBLaKmn9E4nZHQ8N2LwmR458EsAbF4-3YY9Iuz8BsxxcZvYlBsmaCokihc7PQHg5OB95Hd8gy06PAe8ObLOrGGczlnEY27T7A0XDJXepvvxODv7MEEqWW3IWbEFtf8z8nSCEN~ezgoHwdOrP7ly-gWeERW58rOAyLvrB-X295Sj2AkiiCKiXiZew__&Key-Pair-Id=K1NVBEPVH9LWJP",
  },
];

export const sampleSearchNPIs = [
  {
    title: "United Health Care",
    npi: "1649201278",
  },
  {
    title: "Cigna",
    npi: "1649201278",
  },
];

// http://localhost:8081/search?npi=1417956673&npi=1831186477&npi=1730146846&npi=1427002070&npi=1336172337&npi=1669490462&npi=1912018839&npi=1851470124&npi=1770646770&npi=1255531224&npi=1417273616&npi=1003188491&npi=1508369158&npi=1417514829&level=2
