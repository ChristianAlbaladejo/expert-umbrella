export class Product{
    constructor(
        public Id: string,
        public Name: string,
        public BaseSaleFormatId: string,
        public publicButtonText: string,
        public Color: string,
        public PLU: string ,
        public FamilyId: string,
        public VatId: string,
        public UseAsDirectSale: string,
        public SaleableAsMain: string,
        public SaleableAsAddin: string,
        public IsSoldByWeight: string,
        public AskForPreparationNotes: string,
        public AskForAddins: string,
        public PrintWhenPriceIsZero: string,
        public PreparationTypeId: string,
        public PreparationOrderId: string,
        public CostPrice: string,
        public MinAddins: string,
        public MaxAddins: string,
        public Barcodes: string,
        public Prices: string,
        public Addins: string,
        public AddinRoles: string,
        public IsMenu: string
    ){}
}