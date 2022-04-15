import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MempoolSpaceUTXO as UTXO } from "../types/mempool-utxo";

const IndexPage = () => {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [unspents, setUnspents] = useState<UTXO[]>();
  useEffect(() => {
    const init = async () => {
      if (router.query.address) {
        setAddress(router.query.address as string);
        const getUnspent = await axios
          .get(`https://mempool.space/api/address/${router.query.address}/utxo`)
          .then((res) => res.data as UTXO[]);
        setUnspents(getUnspent);
      }
    };
    init();
  }, [router]);
  const handleOnChangeAddress = (e: { target: { value: string } }) => {
    setAddress(e.target.value);
  };

  const onSubmitAddress = (e : React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();
    router.replace('?address='+ address)
  }

  const totalValue: number = unspents?.reduce((pre, cur) => pre + cur.value, 0);

  return (
    <Container>
      <form onSubmit={onSubmitAddress}>
        <Box sx={{ display: "flex" }}>
          <TextField
            label="Address"
            value={address}
            onChange={handleOnChangeAddress}
            focused
          />
          <Button sx={{ mx: 2 }} variant="contained" size="large" type="submit">
            Search
          </Button>
        </Box>
      </form>

      <Card sx={{ my: 3 }}>
        <CardContent>
          <Typography variant="h2" component="div">
            {new Intl.NumberFormat().format(totalValue)} sats
          </Typography>
        </CardContent>
      </Card>
      <div>
        {unspents?.map((unspent) => (
          <Card sx={{ minWidth: 275, my: 3 }} key={unspent.txid}>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                <a
                  href={`https://mempool.space/tx/${unspent.txid}`}
                  target="_blank"
                >
                  {unspent.txid}
                </a>
              </Typography>

              <Typography variant="h5" component="div">
                {new Intl.NumberFormat().format(unspent.value)} sats
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default IndexPage;
