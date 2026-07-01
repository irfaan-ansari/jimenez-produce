import { ProductSelectType } from "@/lib/db/schema";
import { styles } from "./styles";
import { formatUSD } from "@/lib/utils";
import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { format } from "date-fns";

const colors = {
  background: "#13360c",
  border: "#d9f99d",
  text: "#ffffff",
};
interface CatalogProps {
  orgName: string;
  products: Record<string, ProductSelectType[]>;
  effectiveFrom: string | Date;
  effectiveTo: string | Date;
  featured: ProductSelectType[];
}
export const CatalogPDF = (data: CatalogProps) => {
  const { orgName, products, effectiveFrom, effectiveTo, featured } = data;
  return (
    <Document>
      <Page
        size="A4"
        style={[
          styles.page,
          {
            backgroundColor: colors.background,
            paddingVertical: 12,
            paddingHorizontal: 12,
          },
        ]}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              borderBottom: 0,
              paddingBottom: 0,
              justifyContent: "space-between",
              marginBottom: 12,
            },
          ]}
        >
          <View style={{ ...styles.headerLeft, gap: 12 }}>
            <View
              style={{
                borderWidth: 2,
                borderColor: colors.border,
                backgroundColor: "#f7fee7",
                width: 60,
                height: 60,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src={process.env.BETTER_AUTH_URL + "/logo.png"}
                style={{ ...styles.logo, width: 50 }}
              />
            </View>
            <View>
              <Text
                style={[
                  styles.docTitle,
                  {
                    color: "#fff",
                    marginBottom: 18,
                    textTransform: "uppercase",
                  },
                ]}
              >
                Jimenez Produce
              </Text>
              <Text
                style={[
                  styles.label,
                  {
                    color: "#fff",
                    fontSize: 9,
                    lineHeight: 1.2,
                    fontWeight: 500,
                  },
                ]}
              >
                Weekly Price List • Food Service Distribution
              </Text>
              <Text style={[styles.label, { color: colors.border }]}>
                {orgName}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View
              style={{
                display: "flex",
                justifyContent: "flex-end",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  ...styles.label,
                  color: "#d9f99d",
                  textAlign: "left",
                  marginRight: 4,
                }}
              >
                Week of &nbsp;•
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "right",
                  color: "#fff",
                }}
              >
                {format(effectiveFrom, "MMMM dd")} -{" "}
                {format(effectiveTo, "MMMM dd")}
              </Text>
            </View>
            <Text
              style={{ ...styles.label, color: "#fff", textTransform: "none" }}
            >
              Office: (337) 896-0060
            </Text>
            <Text
              style={{ ...styles.label, color: "#fff", textTransform: "none" }}
            >
              Admin: (337) 840-1440
            </Text>
            <Text
              style={{ ...styles.label, color: "#fff", textTransform: "none" }}
            >
              Sales: (769) 684-8857
            </Text>
          </View>
        </View>

        {/* FEATURED */}
        <View
          style={{
            gap: 12,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {featured.map((product, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                borderWidth: 2,
                borderColor: colors.border,
                backgroundColor: "#f7fee7",
                borderRadius: 12,
                padding: 8,
              }}
            >
              <Image
                src={product.image ?? ""}
                style={{
                  width: 40,
                  height: 40,
                  alignSelf: "center",
                  marginBottom: 4,
                }}
              />
              <Text style={[styles.label, { fontSize: 8 }]}>
                {product.title}
              </Text>
              <Text
                style={[
                  styles.tagline,
                  { color: colors.background, fontWeight: "bold" },
                ]}
              >
                {formatUSD(product.basePrice)}
              </Text>
            </View>
          ))}
        </View>

        {/* DYNAMIC CATEGORY BLOCKS LOOP */}

        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            marginTop: 12,
            flexGrow: 1,
            flexShrink: 0,
          }}
        >
          {/* DYNAMIC CATEGORY BLOCKS LOOP */}
          {Object.entries(products).map(
            ([category, products]: [string, any], i) => (
              <View key={category}>
                {/* Category Header */}
                <View
                  style={{
                    backgroundColor: colors.border,
                    width: "100%",
                    borderTopLeftRadius: i === 0 ? 12 : 0,
                    borderTopRightRadius: i === 0 ? 12 : 0,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.background,
                        fontSize: 8,
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      },
                    ]}
                  >
                    {category}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    paddingHorizontal: 12,
                  }}
                >
                  {products?.map((product: any) => (
                    <View
                      key={product.id}
                      style={{
                        width: "48.5%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        paddingVertical: 3,
                        borderBottomWidth: 1,
                        borderBottomColor: "#f2f5f3",
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text
                          style={[
                            styles.label,
                            {
                              fontSize: 8,
                              textTransform: "none",
                              lineHeight: 1.2,
                            },
                          ]}
                        >
                          {product.title}
                        </Text>
                      </View>
                      <View style={{ flexShrink: 0, textAlign: "right" }}>
                        <Text
                          style={[
                            styles.tagline,
                            {
                              color: colors.background,
                              fontWeight: "bold",
                              fontSize: 8,
                            },
                          ]}
                        >
                          {formatUSD(product.basePrice)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ),
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            paddingVertical: 16,
            backgroundColor: "#f7fee7",
            marginLeft: -12,
            marginRight: -12,
            marginBottom: -12,
            marginTop: 12,
          }}
        >
          <View
            style={{
              paddingHorizontal: 16,
              borderRightWidth: 1,
              borderColor: colors.border,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/leaf.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Fresh Quanlity
              </Text>
              <Text>Hand selected produce</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              borderRightWidth: 1,
              borderColor: colors.border,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/price.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Great Prices
              </Text>
              <Text>Competitive prices every week</Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              flex: 1,
              gap: 8,
            }}
          >
            <Image
              src={process.env.BETTER_AUTH_URL + "/icons/truck.png"}
              style={{ width: 28, height: 28 }}
            />
            <View>
              <Text style={{ ...styles.label, color: colors.background }}>
                Reliable Delivery
              </Text>
              <Text>On time delivery you can count on</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
